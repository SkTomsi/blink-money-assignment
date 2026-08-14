import { create } from "zustand";
import { buildSeed } from "../data/seed";
import { CURRENT_USER } from "../data/users";
import { mockRequest } from "../lib/mockRequest";
import {
	getActiveMembers,
	getCircle,
	getCircleStreak,
	getGoalProgress,
	getPeriodProgress,
	getTotalInvested,
	isStreakAtRisk,
	sortByCreatedDesc,
} from "../lib/stats";
import {
	type CreateCircleInput,
	checkIn as svcCheckIn,
	createCircle as svcCreateCircle,
	inviteMember as svcInviteMember,
	nudgeMember as svcNudgeMember,
} from "../services/circleService";
import { clearDB, loadDB, saveDB } from "../services/db";
import { markAllRead, markRead } from "../services/notificationService";
import type {
	CheckIn,
	Circle,
	CircleMember,
	DB,
	Notification,
	User,
} from "../types";

type State = {
	db: DB | null;
	hydrated: boolean;
	offline: boolean;
	hydrate: () => Promise<void>;
	reseed: () => Promise<void>;
	setOffline: (offline: boolean) => void;
	createCircle: (input: CreateCircleInput) => Promise<Circle>;
	inviteMember: (circleId: string, userId: string) => Promise<void>;
	checkIn: (circleId: string) => Promise<CheckIn>;
	nudgeMember: (circleId: string, userId: string) => Promise<void>;
	markNotificationRead: (notificationId: string) => Promise<void>;
	markAllNotificationsRead: () => Promise<void>;
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
		const seed = buildSeed();
		await clearDB();
		await saveDB(seed);
		set({ db: seed, hydrated: true });
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
			}),
		);
		await saveDB(get().db!);
		return result.circle;
	},

	inviteMember: async (circleId, userId) => {
		const { db, offline } = get();
		if (!db || offline) throw new Error("Offline");
		const result = await mockRequest(() =>
			svcInviteMember(db, circleId, userId),
		);
		set(
			mergeDB(get(), {
				members: result.db.members,
				notifications: result.db.notifications,
			}),
		);
		await saveDB(get().db!);
	},

	checkIn: async (circleId) => {
		const { db, offline } = get();
		if (!db || offline) throw new Error("Offline");
		const result = await mockRequest(() =>
			svcCheckIn(db, circleId, CURRENT_USER.id),
		);
		set(mergeDB(get(), { checkIns: result.db.checkIns }));
		await saveDB(get().db!);
		return result.checkIn;
	},

	nudgeMember: async (circleId, userId) => {
		const { db, offline } = get();
		if (!db || offline) throw new Error("Offline");
		const result = await mockRequest(() =>
			svcNudgeMember(db, circleId, userId, CURRENT_USER.id),
		);
		set(mergeDB(get(), { notifications: result.db.notifications }));
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

export function useUsers(): User[] {
	const db = useCircleStore((s) => s.db);
	return db?.users ?? [];
}

export function useUserMap(): Record<string, User> {
	const db = useCircleStore((s) => s.db);
	const map: Record<string, User> = {};
	for (const user of db?.users ?? []) {
		map[user.id] = user;
	}
	return map;
}

export function useOverview(circleId: string) {
	const db = useCircleStore((s) => s.db);
	if (!db) return null;
	const circle = getCircle(db, circleId);
	if (!circle) return null;
	const members = getActiveMembers(db, circleId);
	const circleCheckIns = db.checkIns.filter((c) => c.circleId === circleId);
	const total = getTotalInvested(circleCheckIns);
	const progress = getPeriodProgress(
		circle,
		members,
		circleCheckIns,
		new Date(),
	);
	const goal = getGoalProgress(circle, total);
	const streak = getCircleStreak(circle, members, circleCheckIns, new Date());
	const atRisk = isStreakAtRisk(circle, members, circleCheckIns, new Date());
	return { circle, members, total, progress, goal, streak, atRisk };
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

export function useDashboardStats() {
	const db = useCircleStore((s) => s.db);
	if (!db) {
		return { totalInvested: 0, totalInvestments: 0, circleCount: 0 };
	}
	const mine = db.checkIns.filter((c) => c.userId === CURRENT_USER.id);
	const totalInvested = mine.reduce((sum, c) => sum + c.amount, 0);
	return {
		totalInvested,
		totalInvestments: mine.length,
		circleCount: db.circles.length,
	};
}
