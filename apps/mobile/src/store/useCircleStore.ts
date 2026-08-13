import { create } from "zustand";
import { buildSeed } from "../data/seed";
import { CURRENT_USER } from "../data/users";
import { mockRequest } from "../lib/mockRequest";
import {
	filterActivities,
	getActiveMembers,
	getCircle,
	getCircleStreak,
	getGoalProgress,
	getMemberByUser,
	getPeriodProgress,
	getPersonalStreak,
	getTotalInvested,
	groupFeed,
	isStreakAtRisk,
	MILESTONES,
	sortByCreatedDesc,
} from "../lib/stats";
import { toggleReaction as svcToggleReaction } from "../services/activityService";
import {
	completeChallenge as svcCompleteChallenge,
	createChallenge as svcCreateChallenge,
} from "../services/challengeService";
import {
	type CreateCircleInput,
	acceptInvite as svcAcceptInvite,
	addMember as svcAddMember,
	checkIn as svcCheckIn,
	createCircle as svcCreateCircle,
	inviteMember as svcInviteMember,
	leaveCircle as svcLeaveCircle,
	nudge as svcNudge,
	updateContribution as svcUpdateContribution,
} from "../services/circleService";
import { clearDB, loadDB, saveDB } from "../services/db";
import { markAllRead, markRead } from "../services/notificationService";
import type {
	Activity,
	CheckIn,
	Circle,
	CircleMember,
	DB,
	Notification,
	ReactionEmoji,
} from "../types";

type State = {
	db: DB | null;
	hydrated: boolean;
	offline: boolean;
	hydrate: () => Promise<void>;
	reseed: () => Promise<void>;
	setOffline: (offline: boolean) => void;
	createCircle: (input: CreateCircleInput) => Promise<Circle>;
	addMember: (circleId: string, userId: string) => Promise<void>;
	inviteMember: (circleId: string, userId: string) => Promise<void>;
	acceptInvite: (circleId: string) => Promise<void>;
	updateContribution: (
		circleId: string,
		memberId: string,
		amount: number,
	) => Promise<void>;
	checkIn: (circleId: string) => Promise<CheckIn>;
	nudge: (circleId: string, toUserId: string) => Promise<void>;
	leaveCircle: (circleId: string) => Promise<void>;
	toggleReaction: (activityId: string, emoji: ReactionEmoji) => Promise<void>;
	markNotificationRead: (notificationId: string) => Promise<void>;
	markAllNotificationsRead: () => Promise<void>;
	createChallenge: (
		circleId: string,
		type: "7-day" | "30-day" | "10k" | "step-up",
	) => Promise<void>;
	completeChallenge: (challengeId: string) => Promise<void>;
};

const mergeDB = (state: State, delta: Partial<DB>): Partial<State> => {
	return state.db ? { db: { ...state.db, ...delta } } : { db: state.db };
};

export const useCircleStore = create<State>()((set, get) => ({
	db: null,
	hydrated: false,
	offline: false,

	hydrate: async () => {
		const db = await loadDB();
		set({ db, hydrated: true });
	},

	reseed: async () => {
		await clearDB();
		set({ db: buildSeed(), hydrated: true });
	},

	setOffline: (offline) => set({ offline }),

	createCircle: async (input) => {
		const { db, offline } = get();
		if (!db || offline) throw new Error("Offline");
		const result = await mockRequest(() =>
			svcCreateCircle(db, CURRENT_USER.id, input),
		);
		set(
			mergeDB(get(), {
				circles: result.db.circles,
				members: result.db.members,
				activities: result.db.activities,
			}),
		);
		await saveDB(get().db!);
		return result.circle;
	},

	addMember: async (circleId, userId) => {
		const { db, offline } = get();
		if (!db || offline) throw new Error("Offline");
		const result = await mockRequest(() => svcAddMember(db, circleId, userId));
		set(
			mergeDB(get(), {
				members: result.db.members,
				activities: result.db.activities,
				notifications: result.db.notifications,
			}),
		);
		await saveDB(get().db!);
	},

	inviteMember: async (circleId, userId) => {
		const { db, offline } = get();
		if (!db || offline) throw new Error("Offline");
		const result = await mockRequest(() =>
			svcInviteMember(db, circleId, CURRENT_USER.id, userId),
		);
		set(
			mergeDB(get(), {
				members: result.db.members,
				notifications: result.db.notifications,
			}),
		);
		await saveDB(get().db!);
	},

	acceptInvite: async (circleId) => {
		const { db, offline } = get();
		if (!db || offline) throw new Error("Offline");
		const result = await mockRequest(() =>
			svcAcceptInvite(db, circleId, CURRENT_USER.id),
		);
		set(
			mergeDB(get(), {
				members: result.db.members,
				activities: result.db.activities,
			}),
		);
		await saveDB(get().db!);
	},

	updateContribution: async (circleId, memberId, amount) => {
		const { db, offline } = get();
		if (!db || offline) throw new Error("Offline");
		const result = await mockRequest(() =>
			svcUpdateContribution(db, circleId, memberId, amount),
		);
		const delta: Partial<DB> = { members: result.db.members };
		if (result.activity) delta.activities = result.db.activities;
		set(mergeDB(get(), delta));
		await saveDB(get().db!);
	},

	checkIn: async (circleId) => {
		const { db, offline } = get();
		if (!db || offline) throw new Error("Offline");
		const result = await mockRequest(() =>
			svcCheckIn(db, circleId, CURRENT_USER.id),
		);
		set(
			mergeDB(get(), {
				checkIns: result.db.checkIns,
				activities: result.db.activities,
				notifications: result.db.notifications,
			}),
		);
		await saveDB(get().db!);
		return result.checkIn;
	},

	nudge: async (circleId, toUserId) => {
		const { db, offline } = get();
		if (!db || offline) throw new Error("Offline");
		const result = await mockRequest(() =>
			svcNudge(db, circleId, CURRENT_USER.id, toUserId),
		);
		set(mergeDB(get(), { notifications: result.db.notifications }));
		await saveDB(get().db!);
	},

	leaveCircle: async (circleId) => {
		const { db, offline } = get();
		if (!db || offline) throw new Error("Offline");
		const result = await mockRequest(() =>
			svcLeaveCircle(db, circleId, CURRENT_USER.id),
		);
		set({
			db: {
				...result.db,
			},
		});
		await saveDB(get().db!);
	},

	toggleReaction: async (activityId, emoji) => {
		const { db, offline } = get();
		if (!db || offline) throw new Error("Offline");
		const result = await mockRequest(
			() => svcToggleReaction(db, activityId, CURRENT_USER.id, emoji),
			{ minMs: 150, maxMs: 350 },
		);
		set(mergeDB(get(), { activities: result.db.activities }));
		await saveDB(get().db!);
	},

	markNotificationRead: async (notificationId) => {
		const { db, offline } = get();
		if (!db || offline) throw new Error("Offline");
		const result = await mockRequest(
			() => markRead(db, CURRENT_USER.id, notificationId),
			{ minMs: 100, maxMs: 250 },
		);
		set(mergeDB(get(), { notifications: result.db.notifications }));
		await saveDB(get().db!);
	},

	markAllNotificationsRead: async () => {
		const { db, offline } = get();
		if (!db || offline) throw new Error("Offline");
		const result = await mockRequest(() => markAllRead(db, CURRENT_USER.id), {
			minMs: 100,
			maxMs: 250,
		});
		set(mergeDB(get(), { notifications: result.db.notifications }));
		await saveDB(get().db!);
	},

	createChallenge: async (circleId, type) => {
		const { db, offline } = get();
		if (!db || offline) throw new Error("Offline");
		const result = await mockRequest(() =>
			svcCreateChallenge(db, circleId, type),
		);
		set(mergeDB(get(), { challenges: result.db.challenges }));
		await saveDB(get().db!);
	},

	completeChallenge: async (challengeId) => {
		const { db, offline } = get();
		if (!db || offline) throw new Error("Offline");
		const result = await mockRequest(() =>
			svcCompleteChallenge(db, challengeId),
		);
		set(mergeDB(get(), { challenges: result.db.challenges }));
		await saveDB(get().db!);
	},
}));

// ---- Selector hooks ----

export function useCircles(): Circle[] {
	const db = useCircleStore((s) => s.db);
	return db?.circles ?? [];
}

export function useCircle(circleId: string): Circle | null {
	const db = useCircleStore((s) => s.db);
	return db ? (getCircle(db, circleId) ?? null) : null;
}

export function useMembers(circleId: string): CircleMember[] {
	const db = useCircleStore((s) => s.db);
	return db ? getActiveMembers(db, circleId) : [];
}

export function useCurrentMember(circleId: string): CircleMember | null {
	const db = useCircleStore((s) => s.db);
	return db ? (getMemberByUser(db, circleId, CURRENT_USER.id) ?? null) : null;
}

export function useOverview(circleId: string) {
	const db = useCircleStore((s) => s.db);
	if (!db) return null;
	const circle = getCircle(db, circleId);
	if (!circle) return null;
	const members = getActiveMembers(db, circleId);
	const total = getTotalInvested(
		db.checkIns.filter((c) => c.circleId === circleId),
	);
	const progress = getPeriodProgress(circle, members, db.checkIns, new Date());
	const goal = getGoalProgress(circle, total);
	const streak = getCircleStreak(circle, members, db.checkIns, new Date());
	const atRisk = isStreakAtRisk(circle, members, db.checkIns, new Date());
	return { circle, members, total, progress, goal, streak, atRisk };
}

export function usePersonalStreak(circleId: string): number {
	const db = useCircleStore((s) => s.db);
	if (!db) return 0;
	const circle = getCircle(db, circleId);
	if (!circle) return 0;
	return getPersonalStreak(
		CURRENT_USER.id,
		circle.frequency,
		db.checkIns.filter((c) => c.circleId === circleId),
		new Date(),
	);
}

export function useActivities(circleId: string): Activity[] {
	const db = useCircleStore((s) => s.db);
	if (!db) return [];
	return sortByCreatedDesc(
		db.activities.filter((a) => a.circleId === circleId),
	);
}

export function useFeed(
	circleId: string,
	filter: "all" | "investments" | "milestones" | "members" = "all",
): { label: string; items: Activity[] }[] {
	const activities = useActivities(circleId);
	return groupFeed(filterActivities(activities, filter));
}

export function useNotifications(): Notification[] {
	const db = useCircleStore((s) => s.db);
	if (!db) return [];
	return sortByCreatedDesc(
		db.notifications.filter((n) => n.userId === CURRENT_USER.id),
	);
}

export function useUnreadCount(): number {
	const notifications = useNotifications();
	return notifications.filter((n) => !n.read).length;
}

export function useMilestones() {
	return MILESTONES;
}
