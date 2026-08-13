import type {
	Activity,
	Circle,
	CircleMember,
	CheckIn,
	DB,
	Notification,
} from "../types";
import { ApiError } from "../types";
import { nowIso, periodKeyFor } from "../lib/dates";
import { uid } from "../lib/ids";
import { getUser, getActiveMembers, getTotalInvested, getMilestonesCrossed, MILESTONES } from "../lib/stats";

export type CreateCircleInput = {
	name: string;
	type: Circle["type"];
	goal: string;
	goalEmoji: string;
	targetAmount: number;
	targetDate: string;
	frequency: Circle["frequency"];
	contributionMode: Circle["contributionMode"];
	defaultAmount: number;
	groupTarget: number | null;
};

export function createCircle(
	db: DB,
	ownerId: string,
	input: CreateCircleInput
): { db: DB; circle: Circle; member: CircleMember; activity: Activity } {
	if (!input.name.trim()) {
		throw new ApiError("VALIDATION", "Circle name is required");
	}
	const circle: Circle = {
		id: uid("c"),
		...input,
		ownerId,
		inviteSlug: uid("inv"),
		createdAt: nowIso(),
	};
	const member: CircleMember = {
		id: uid("m"),
		circleId: circle.id,
		userId: ownerId,
		role: "owner",
		contributionAmount: input.defaultAmount,
		status: "active",
		showContribution: true,
		joinedAt: nowIso(),
	};
	const activity: Activity = {
		id: uid("a"),
		circleId: circle.id,
		userId: ownerId,
		type: "goal_created",
		metadata: { title: input.goal },
		reactions: {},
		createdAt: nowIso(),
	};
	return {
		db: {
			...db,
			circles: [...db.circles, circle],
			members: [...db.members, member],
			activities: [...db.activities, activity],
		},
		circle,
		member,
		activity,
	};
}

export function addMember(
	db: DB,
	circleId: string,
	userId: string
): { db: DB; member: CircleMember; activity: Activity; notification: Notification } {
	const circle = db.circles.find((c) => c.id === circleId);
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
		contributionAmount: circle.defaultAmount,
		status: "active",
		showContribution: circle.contributionMode !== "individual",
		joinedAt: nowIso(),
	};
	const activity: Activity = {
		id: uid("a"),
		circleId,
		userId,
		type: "member_joined",
		reactions: {},
		createdAt: nowIso(),
	};
	const notification: Notification = {
		id: uid("n"),
		userId,
		circleId,
		title: `You joined ${circle.name}`,
		body: "Welcome to the circle!",
		icon: "👋",
		read: false,
		createdAt: nowIso(),
	};
	return {
		db: {
			...db,
			members: [...db.members, member],
			activities: [...db.activities, activity],
			notifications: [...db.notifications, notification],
		},
		member,
		activity,
		notification,
	};
}

export function inviteMember(
	db: DB,
	circleId: string,
	invitedByUserId: string,
	userId: string
): { db: DB; member: CircleMember; notification: Notification } {
	const circle = db.circles.find((c) => c.id === circleId);
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
		contributionAmount: circle.defaultAmount,
		status: "invited",
		showContribution: circle.contributionMode !== "individual",
		joinedAt: nowIso(),
	};
	const notification: Notification = {
		id: uid("n"),
		userId,
		circleId,
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
		member,
		notification,
	};
}

export function acceptInvite(
	db: DB,
	circleId: string,
	userId: string
): { db: DB; member: CircleMember; activity: Activity } {
	const member = db.members.find(
		(m) => m.circleId === circleId && m.userId === userId
	);
	if (!member) {
		throw new ApiError("NOT_FOUND", "Invitation not found");
	}
	const updated: CircleMember = { ...member, status: "active" };
	const activity: Activity = {
		id: uid("a"),
		circleId,
		userId,
		type: "member_joined",
		reactions: {},
		createdAt: nowIso(),
	};
	return {
		db: {
			...db,
			members: db.members.map((m) =>
				m.id === updated.id ? updated : m
			),
			activities: [...db.activities, activity],
		},
		member: updated,
		activity,
	};
}

export function updateContribution(
	db: DB,
	circleId: string,
	memberId: string,
	amount: number
): { db: DB; member: CircleMember; activity: Activity | null } {
	if (!Number.isFinite(amount) || amount < 0) {
		throw new ApiError("VALIDATION", "Contribution must be a positive number");
	}
	const member = db.members.find((m) => m.id === memberId);
	if (!member || member.circleId !== circleId) {
		throw new ApiError("NOT_FOUND", "Member not found");
	}
	const updated: CircleMember = { ...member, contributionAmount: amount };
	let activity: Activity | null = null;
	if (amount > member.contributionAmount) {
		activity = {
			id: uid("a"),
			circleId,
			userId: member.userId,
			type: "investment_increment",
			metadata: {
				from: member.contributionAmount,
				to: amount,
			},
			reactions: {},
			createdAt: nowIso(),
		};
	}
	return {
		db: {
			...db,
			members: db.members.map((m) => (m.id === memberId ? updated : m)),
			activities: activity ? [...db.activities, activity] : db.activities,
		},
		member: updated,
		activity,
	};
}

export type CheckInResult = {
	db: DB;
	checkIn: CheckIn;
	activity: Activity;
	notification: Notification | null;
	milestoneActivity: Activity | null;
	milestoneNotifications: Notification[];
};

export function checkIn(
	db: DB,
	circleId: string,
	userId: string
): CheckInResult {
	const circle = db.circles.find((c) => c.id === circleId);
	if (!circle) {
		throw new ApiError("NOT_FOUND", "Circle not found");
	}
	const member = db.members.find(
		(m) => m.circleId === circleId && m.userId === userId
	);
	if (!member || member.status !== "active") {
		throw new ApiError("VALIDATION", "Not an active member of this circle");
	}

	const now = new Date();
	const periodKey = periodKeyFor(now, circle.frequency);
	const already = db.checkIns.some(
		(c) => c.circleId === circleId && c.userId === userId && c.periodKey === periodKey
	);
	if (already) {
		throw new ApiError("VALIDATION", "Already checked in for this period");
	}

	const checkIn: CheckIn = {
		id: uid("ci"),
		circleId,
		userId,
		periodKey,
		amount: member.contributionAmount,
		createdAt: nowIso(),
	};

	const activity: Activity = {
		id: uid("a"),
		circleId,
		userId,
		type: "investment",
		amount: member.contributionAmount,
		reactions: {},
		createdAt: nowIso(),
	};

	const nextDB: DB = {
		...db,
		checkIns: [...db.checkIns, checkIn],
		activities: [...db.activities, activity],
	};

	// milestone detection
	const before = getTotalInvested(db.checkIns);
	const after = before + member.contributionAmount;
	const crossed = getMilestonesCrossed(before)
		.length < getMilestonesCrossed(after).length
		? MILESTONES.filter(
				(m) => m.threshold > before && m.threshold <= after
		  )
		: [];

	let milestoneActivity: Activity | null = null;
	let milestoneNotifications: Notification[] = [];
	if (crossed.length > 0) {
		const milestone = crossed[0];
		milestoneActivity = {
			id: uid("a"),
			circleId,
			userId,
			type: "milestone",
			metadata: {
				milestone: milestone.label,
				title: `${circle.name} crossed ${milestone.label}`,
			},
			reactions: {},
			createdAt: nowIso(),
		};
		nextDB.activities = [...nextDB.activities, milestoneActivity];
		milestoneNotifications = getActiveMembers(db, circleId)
			.filter((m) => m.userId !== userId)
			.map((m) => ({
				id: uid("n"),
				userId: m.userId,
				circleId,
				title: `${circle.name} crossed ${milestone.label}!`,
				body: "A new milestone was reached.",
				icon: "🎉",
				read: false,
				createdAt: nowIso(),
			}));
		nextDB.notifications = [
			...nextDB.notifications,
			...milestoneNotifications,
		];
	}

	const notification: Notification | null = {
		id: uid("n"),
		userId,
		circleId,
		title: "Investment recorded",
		body: `₹${member.contributionAmount} added to ${circle.name}`,
		icon: "💰",
		read: false,
		createdAt: nowIso(),
	};
	nextDB.notifications = [...nextDB.notifications, notification];

	return {
		db: nextDB,
		checkIn,
		activity,
		notification,
		milestoneActivity,
		milestoneNotifications,
	};
}

export function nudge(
	db: DB,
	circleId: string,
	fromUserId: string,
	toUserId: string
): { db: DB; notification: Notification } {
	const to = getUser(db, toUserId);
	if (!to) {
		throw new ApiError("NOT_FOUND", "User not found");
	}
	const notification: Notification = {
		id: uid("n"),
		userId: toUserId,
		circleId,
		title: "You've been nudged",
		body: "Your circle is waiting on your investment.",
		icon: "⏰",
		read: false,
		createdAt: nowIso(),
	};
	return {
		db: {
			...db,
			notifications: [...db.notifications, notification],
		},
		notification,
	};
}

export function leaveCircle(
	db: DB,
	circleId: string,
	userId: string
): { db: DB; circle: Circle; activity: Activity | null } {
	const circle = db.circles.find((c) => c.id === circleId);
	if (!circle) {
		throw new ApiError("NOT_FOUND", "Circle not found");
	}
	const member = db.members.find(
		(m) => m.circleId === circleId && m.userId === userId
	);
	if (!member) {
		throw new ApiError("NOT_FOUND", "Member not found");
	}

	// owner leaving removes circle + all related data
	if (member.role === "owner") {
		return {
			db: {
				...db,
				circles: db.circles.filter((c) => c.id !== circleId),
				members: db.members.filter((m) => m.circleId !== circleId),
				activities: db.activities.filter((a) => a.circleId !== circleId),
				checkIns: db.checkIns.filter((c) => c.circleId !== circleId),
				challenges: db.challenges.filter((c) => c.circleId !== circleId),
			},
			circle,
			activity: null,
		};
	}

	return {
		db: {
			...db,
			members: db.members.filter((m) => m.id !== member.id),
		},
		circle,
		activity: null,
	};
}