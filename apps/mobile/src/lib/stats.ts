import type { CheckIn, Circle, CircleMember, DB } from "../types";
import { periodKeyFor, previousPeriod } from "./dates";

export function getMembers(db: DB, circleId: string): CircleMember[] {
	return db.members.filter((m) => m.circleId === circleId);
}

export function getActiveMembers(db: DB, circleId: string): CircleMember[] {
	return getMembers(db, circleId).filter((m) => m.status === "active");
}

export function getCircle(db: DB, circleId: string): Circle | undefined {
	return db.circles.find((c) => c.id === circleId);
}

export function getPeriodInvestedFor(
	periodKey: string,
	checkIns: CheckIn[],
): number {
	return checkIns
		.filter((c) => c.periodKey === periodKey)
		.reduce((sum, c) => sum + c.amount, 0);
}

export function getTotalInvested(checkIns: CheckIn[]): number {
	return checkIns.reduce((sum, c) => sum + c.amount, 0);
}

export type PeriodProgress = {
	invested: number;
	target: number;
	pct: number;
	completedUserIds: string[];
	dueUserIds: string[];
};

export function getPeriodProgress(
	circle: Circle,
	activeMembers: CircleMember[],
	checkIns: CheckIn[],
	now: Date,
): PeriodProgress {
	const periodKey = periodKeyFor(now, circle.frequency);
	const invested = getPeriodInvestedFor(periodKey, checkIns);
	const target = circle.contributionAmount * activeMembers.length;
	const checkedIn = new Set(
		checkIns.filter((c) => c.periodKey === periodKey).map((c) => c.userId),
	);
	const completed = activeMembers.filter((m) => checkedIn.has(m.userId));
	const due = activeMembers.filter((m) => !checkedIn.has(m.userId));
	return {
		invested,
		target,
		pct: target > 0 ? Math.min(1, invested / target) : 0,
		completedUserIds: completed.map((m) => m.userId),
		dueUserIds: due.map((m) => m.userId),
	};
}

export type GoalProgress = {
	amount: number;
	target: number;
	pct: number;
};

export function getGoalProgress(
	circle: Circle,
	totalInvested: number,
): GoalProgress {
	return {
		amount: totalInvested,
		target: circle.targetAmount,
		pct:
			circle.targetAmount > 0
				? Math.min(1, totalInvested / circle.targetAmount)
				: 0,
	};
}

function hasCheckInInPeriod(
	checkIns: CheckIn[],
	userId: string,
	periodKey: string,
): boolean {
	return checkIns.some((c) => c.userId === userId && c.periodKey === periodKey);
}

function allChecked(
	checkIns: CheckIn[],
	members: CircleMember[],
	periodKey: string,
): boolean {
	return members.every((m) => hasCheckInInPeriod(checkIns, m.userId, periodKey));
}

export function getCircleStreak(
	circle: Circle,
	activeMembers: CircleMember[],
	checkIns: CheckIn[],
	now: Date,
): number {
	const today = periodKeyFor(now, circle.frequency);
	let cursor = allChecked(checkIns, activeMembers, today)
		? today
		: previousPeriod(today, circle.frequency);
	let streak = 0;
	while (allChecked(checkIns, activeMembers, cursor)) {
		streak += 1;
		cursor = previousPeriod(cursor, circle.frequency);
	}
	return streak;
}

export function isStreakAtRisk(
	circle: Circle,
	activeMembers: CircleMember[],
	checkIns: CheckIn[],
	now: Date,
): boolean {
	const streak = getCircleStreak(circle, activeMembers, checkIns, now);
	if (streak <= 0) return false;
	const current = periodKeyFor(now, circle.frequency);
	return !allChecked(checkIns, activeMembers, current);
}

export function sortByCreatedDesc<T extends { createdAt: string }>(
	items: T[],
): T[] {
	return [...items].sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);
}
