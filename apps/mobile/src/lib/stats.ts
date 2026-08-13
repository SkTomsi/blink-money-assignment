import type {
	Activity,
	CheckIn,
	Circle,
	CircleMember,
	DB,
	Frequency,
} from "../types";
import { addDays, periodKeyFor, previousPeriod, toKey } from "./dates";

export const MILESTONES = [
	{ threshold: 10000, emoji: "🌱", label: "₹10K" },
	{ threshold: 25000, emoji: "🌿", label: "₹25K" },
	{ threshold: 50000, emoji: "🌳", label: "₹50K" },
	{ threshold: 100000, emoji: "🏆", label: "₹1L" },
	{ threshold: 500000, emoji: "💎", label: "₹5L" },
];

export const ACTIVITY_FILTERS = ["all", "investments", "milestones", "members"] as const;
export type ActivityFilter = (typeof ACTIVITY_FILTERS)[number];

export function getMembers(db: DB, circleId: string): CircleMember[] {
	return db.members.filter((m) => m.circleId === circleId);
}

export function getActiveMembers(db: DB, circleId: string): CircleMember[] {
	return getMembers(db, circleId).filter((m) => m.status === "active");
}

export function getCircle(db: DB, circleId: string): Circle | undefined {
	return db.circles.find((c) => c.id === circleId);
}

export function getUser(db: DB, userId: string) {
	return db.users.find((u) => u.id === userId);
}

export function getMemberByUser(
	db: DB,
	circleId: string,
	userId: string
): CircleMember | undefined {
	return db.members.find(
		(m) => m.circleId === circleId && m.userId === userId
	);
}

export function getPeriodInvestedFor(
	periodKey: string,
	checkIns: CheckIn[]
): number {
	return checkIns
		.filter((c) => c.periodKey === periodKey)
		.reduce((sum, c) => sum + c.amount, 0);
}

export function getTotalInvested(checkIns: CheckIn[]): number {
	return checkIns.reduce((sum, c) => sum + c.amount, 0);
}

export function getPeriodTarget(
	circle: Circle,
	activeMembers: CircleMember[]
): number {
	if (circle.contributionMode === "group-target") {
		return circle.groupTarget ?? 0;
	}
	if (circle.contributionMode === "equal") {
		return circle.defaultAmount * activeMembers.length;
	}
	return activeMembers.reduce((sum, m) => sum + m.contributionAmount, 0);
}

export type PeriodProgress = {
	invested: number;
	target: number;
	pct: number;
	completedUserIds: string[];
	dueUserIds: string[];
	lastUserId: string | null;
};

export function getPeriodProgress(
	circle: Circle,
	activeMembers: CircleMember[],
	checkIns: CheckIn[],
	now: Date
): PeriodProgress {
	const periodKey = periodKeyFor(now, circle.frequency);
	const invested = getPeriodInvestedFor(periodKey, checkIns);
	const target = getPeriodTarget(circle, activeMembers);
	const checkedIn = new Set(
		checkIns.filter((c) => c.periodKey === periodKey).map((c) => c.userId)
	);
	const completed = activeMembers.filter((m) => checkedIn.has(m.userId));
	const due = activeMembers.filter((m) => !checkedIn.has(m.userId));
	return {
		invested,
		target,
		pct: target > 0 ? Math.min(1, invested / target) : 0,
		completedUserIds: completed.map((m) => m.userId),
		dueUserIds: due.map((m) => m.userId),
		lastUserId: due.length > 0 ? due[due.length - 1].userId : null,
	};
}

export type GoalProgress = {
	amount: number;
	target: number;
	pct: number;
};

export function getGoalProgress(
	circle: Circle,
	totalInvested: number
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

export function getMilestonesCrossed(totalInvested: number) {
	return MILESTONES.filter((m) => m.threshold <= totalInvested);
}

export function getLastMilestone(totalInvested: number) {
	const crossed = getMilestonesCrossed(totalInvested);
	return crossed.length > 0 ? crossed[crossed.length - 1] : null;
}

function hasCheckInInPeriod(
	checkIns: CheckIn[],
	userId: string,
	periodKey: string
): boolean {
	return checkIns.some((c) => c.userId === userId && c.periodKey === periodKey);
}

function allChecked(
	checkIns: CheckIn[],
	members: CircleMember[],
	periodKey: string
): boolean {
	return members.every((m) => hasCheckInInPeriod(checkIns, m.userId, periodKey));
}

export function getPersonalStreak(
	userId: string,
	frequency: Frequency,
	checkIns: CheckIn[],
	now: Date
): number {
	const today = periodKeyFor(now, frequency);
	let cursor = hasCheckInInPeriod(checkIns, userId, today)
		? today
		: previousPeriod(today, frequency);
	let streak = 0;
	while (hasCheckInInPeriod(checkIns, userId, cursor)) {
		streak += 1;
		cursor = previousPeriod(cursor, frequency);
	}
	return streak;
}

export function getCircleStreak(
	circle: Circle,
	activeMembers: CircleMember[],
	checkIns: CheckIn[],
	now: Date
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
	now: Date
): boolean {
	const streak = getCircleStreak(circle, activeMembers, checkIns, now);
	if (streak <= 0) return false;
	const current = periodKeyFor(now, circle.frequency);
	return !allChecked(checkIns, activeMembers, current);
}

export function filterActivities(
	activities: Activity[],
	filter: ActivityFilter
): Activity[] {
	switch (filter) {
		case "investments":
			return activities.filter((a) =>
				[
					"investment",
					"contribution_completed",
					"investment_increment",
					"challenge_completed",
				].includes(a.type)
			);
		case "milestones":
			return activities.filter(
				(a) => a.type === "milestone" || a.type === "streak"
			);
		case "members":
			return activities.filter(
				(a) => a.type === "member_joined" || a.type === "goal_created"
			);
		default:
			return activities;
	}
}

export function sortByCreatedDesc<T extends { createdAt: string }>(
	items: T[]
): T[] {
	return [...items].sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);
}

export function groupFeed(
	activities: Activity[]
): { label: string; items: Activity[] }[] {
	const today = toKey(new Date());
	const yesterday = toKey(addDays(new Date(), -1));
	const buckets = new Map<string, Activity[]>();
	for (const activity of sortByCreatedDesc(activities)) {
		const key = toKey(new Date(activity.createdAt));
		const label =
			key === today ? "Today" : key === yesterday ? "Yesterday" : "Earlier";
		const list = buckets.get(label) ?? [];
		list.push(activity);
		buckets.set(label, list);
	}
	const groups: { label: string; items: Activity[] }[] = [];
	for (const label of ["Today", "Yesterday", "Earlier"]) {
		const items = buckets.get(label);
		if (items && items.length > 0) {
			groups.push({ label, items });
		}
	}
	return groups;
}