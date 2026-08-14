import type { CheckIn, Circle, CircleMember, DB, Notification } from "../types";
import { ApiError } from "../types";
import { addMonths, durationInPeriods, nowIso, periodKeyFor } from "../lib/dates";
import { uid } from "../lib/ids";

export type CreateCircleInput = {
	name: string;
	type: Circle["type"];
	frequency: Circle["frequency"];
	/** Amount invested per period — same for everyone. */
	contributionAmount: number;
	durationMonths: number;
	inviteSlug?: string;
};

export function createCircle(
	db: DB,
	ownerId: string,
	input: CreateCircleInput,
): { db: DB; circle: Circle } {
	if (!input.name.trim()) {
		throw new ApiError("VALIDATION", "Circle name is required");
	}
	if (!Number.isFinite(input.contributionAmount) || input.contributionAmount <= 0) {
		throw new ApiError("VALIDATION", "Contribution amount is required");
	}

	const targetDate = addMonths(new Date(), input.durationMonths).toISOString();
	const periods = durationInPeriods(
		input.frequency,
		input.durationMonths,
		targetDate,
	);

	const circle: Circle = {
		id: uid("c"),
		name: input.name.trim(),
		type: input.type,
		ownerId,
		frequency: input.frequency,
		contributionAmount: input.contributionAmount,
		durationMonths: input.durationMonths,
		targetAmount: input.contributionAmount * periods,
		targetDate,
		inviteSlug: input.inviteSlug ?? uid("inv"),
		createdAt: nowIso(),
	};

	const member: CircleMember = {
		id: uid("m"),
		circleId: circle.id,
		userId: ownerId,
		role: "owner",
		status: "active",
		joinedAt: nowIso(),
	};

	return {
		db: {
			...db,
			circles: [...db.circles, circle],
			members: [...db.members, member],
		},
		circle,
	};
}

export function inviteMember(
	db: DB,
	circleId: string,
	userId: string,
): { db: DB } {	const circle = db.circles.find((c) => c.id === circleId);
	if (!circle) {
		throw new ApiError("NOT_FOUND", "Circle not found");
	}
	if (db.members.some((m) => m.circleId === circleId && m.userId === userId)) {
		throw new ApiError("DUPLICATE_MEMBER", "Already a member of this circle");
	}

	const member: CircleMember = {
		id: uid("m"),
		circleId,
		userId,
		role: "member",
		status: "invited",
		joinedAt: nowIso(),
	};
	const notification: Notification = {
		id: uid("n"),
		userId,
		title: `You've been invited to ${circle.name}`,
		body: "Tap to accept your invitation.",
		icon: "💌",
		read: false,
		createdAt: nowIso(),
	};

	return {
		db: {
			...db,
			members: [...db.members, member],
			notifications: [...db.notifications, notification],
		},
	};
}

export function checkIn(
	db: DB,
	circleId: string,
	userId: string,
): { db: DB; checkIn: CheckIn } {
	const circle = db.circles.find((c) => c.id === circleId);
	if (!circle) {
		throw new ApiError("NOT_FOUND", "Circle not found");
	}
	const member = db.members.find(
		(m) => m.circleId === circleId && m.userId === userId && m.status === "active",
	);
	if (!member) {
		throw new ApiError("VALIDATION", "You're not an active member");
	}

	const periodKey = periodKeyFor(new Date(), circle.frequency);
	const existing = db.checkIns.find(
		(c) =>
			c.circleId === circleId && c.userId === userId && c.periodKey === periodKey,
	);
	if (existing) {
		return { db, checkIn: existing };
	}

	const checkIn: CheckIn = {
		id: uid("ci"),
		circleId,
		userId,
		periodKey,
		amount: circle.contributionAmount,
		createdAt: nowIso(),
	};

	return { db: { ...db, checkIns: [...db.checkIns, checkIn] }, checkIn };
}

export function nudgeMember(
	db: DB,
	circleId: string,
	targetUserId: string,
	fromUserId: string,
): { db: DB } {
	const circle = db.circles.find((c) => c.id === circleId);
	if (!circle) {
		throw new ApiError("NOT_FOUND", "Circle not found");
	}
	if (targetUserId === fromUserId) {
		throw new ApiError("VALIDATION", "You can't nudge yourself");
	}
	const member = db.members.find(
		(m) =>
			m.circleId === circleId &&
			m.userId === targetUserId &&
			m.status === "active",
	);
	if (!member) {
		throw new ApiError("VALIDATION", "Not an active member");
	}
	const periodKey = periodKeyFor(new Date(), circle.frequency);
	const alreadyInvested = db.checkIns.some(
		(c) =>
			c.circleId === circleId &&
			c.userId === targetUserId &&
			c.periodKey === periodKey,
	);
	if (alreadyInvested) {
		throw new ApiError("VALIDATION", "They've already invested this period");
	}

	const fromUser = db.users.find((u) => u.id === fromUserId);
	const notification: Notification = {
		id: uid("n"),
		userId: targetUserId,
		title: `${fromUser?.name ?? "Someone"} nudged you`,
		body: `${circle.name} is waiting on you.`,
		icon: "🔔",
		read: false,
		createdAt: nowIso(),
	};

	return { db: { ...db, notifications: [...db.notifications, notification] } };
}
