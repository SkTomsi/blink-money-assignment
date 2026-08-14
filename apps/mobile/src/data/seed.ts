import { addMonths, daysAgo, hoursAgo, monthsAgo, periodKeyFor } from "../lib/dates";
import { uid } from "../lib/ids";
import type { CheckIn, Circle, CircleMember, DB, Notification } from "../types";
import { USER_DIRECTORY } from "./users";

export const CIRCLES = {
	thomas: "c_family",
	future: "c_future",
	boys: "c_boys",
} as const;

function member(
	circleId: string,
	userId: string,
	overrides: Partial<CircleMember> = {},
): CircleMember {
	return {
		id: uid("m"),
		circleId,
		userId,
		role: "member",
		status: "active",
		joinedAt: monthsAgo(2),
		...overrides,
	};
}

function checkIn(
	circleId: string,
	userId: string,
	date: Date,
	amount: number,
	frequency: "daily" | "monthly",
): CheckIn {
	return {
		id: uid("ci"),
		circleId,
		userId,
		periodKey: periodKeyFor(date, frequency),
		amount,
		createdAt: date.toISOString(),
	};
}

function notification(
	userId: string,
	title: string,
	body: string,
	icon: string,
	createdAt: string,
	overrides: Partial<Notification> = {},
): Notification {
	return {
		id: uid("n"),
		userId,
		title,
		body,
		icon,
		read: false,
		createdAt,
		...overrides,
	};
}

const allCircles: Circle[] = [
	{
		id: CIRCLES.thomas,
		name: "Family ❤️",
		type: "family",
		ownerId: "u_you",
		frequency: "monthly",
		contributionAmount: 1000,
		durationMonths: 12,
		targetAmount: 100000,
		targetDate: "2027-12-31T00:00:00.000Z",
		inviteSlug: "family",
		createdAt: monthsAgo(8),
	},
	{
		id: CIRCLES.future,
		name: "Future Goals💛",
		type: "couple",
		ownerId: "u_you",
		frequency: "monthly",
		contributionAmount: 4000,
		durationMonths: 24,
		targetAmount: 5000000,
		targetDate: "2028-12-31T00:00:00.000Z",
		inviteSlug: "our-future",
		createdAt: monthsAgo(4),
	},
	{
		id: CIRCLES.boys,
		name: "The Boys",
		type: "friends",
		ownerId: "u_you",
		frequency: "daily",
		contributionAmount: 100,
		durationMonths: 2,
		targetAmount: 5000,
		targetDate: addMonths(new Date(), 2).toISOString(),
		inviteSlug: "the-boys",
		createdAt: daysAgo(14),
	},
];

const allMembers: CircleMember[] = [
	// Thomas Family — you(owner), dad, mom, tomcy, sarah (all active)
	member(CIRCLES.thomas, "u_you", { role: "owner", joinedAt: monthsAgo(8) }),
	member(CIRCLES.thomas, "u_dad", { joinedAt: monthsAgo(7) }),
	member(CIRCLES.thomas, "u_mom", { joinedAt: monthsAgo(7) }),
	member(CIRCLES.thomas, "u_tomcy", { joinedAt: monthsAgo(5) }),
	member(CIRCLES.thomas, "u_sarah", { joinedAt: monthsAgo(2) }),
	// Our Future — you + partner
	member(CIRCLES.future, "u_you", { role: "owner", joinedAt: monthsAgo(4) }),
	member(CIRCLES.future, "u_partner", { joinedAt: monthsAgo(4) }),
	// The Boys — you, rahul, john, arjun active; maya invited
	member(CIRCLES.boys, "u_you", { role: "owner", joinedAt: daysAgo(14) }),
	member(CIRCLES.boys, "u_rahul", { joinedAt: daysAgo(14) }),
	member(CIRCLES.boys, "u_john", { joinedAt: daysAgo(12) }),
	member(CIRCLES.boys, "u_arjun", { joinedAt: daysAgo(10) }),
	member(CIRCLES.boys, "u_maya", { status: "invited", joinedAt: daysAgo(2) }),
];

function buildCheckIns(): CheckIn[] {
	const out: CheckIn[] = [];
	const now = new Date();

	// Thomas Family — monthly, ₹1,000 each. Total must land on ₹42,000.
	// months -8..-2: 5 members/mo with 2 misses (sarah @ -3, tomcy @ -5)
	const thomasMisses: Record<string, number[]> = {
		u_sarah: [-3],
		u_tomcy: [-5],
	};
	for (const offset of [-8, -7, -6, -5, -4, -3, -2]) {
		const date = new Date(now.getFullYear(), now.getMonth() + offset, 10);
		for (const userId of ["u_you", "u_dad", "u_mom", "u_tomcy", "u_sarah"]) {
			if ((thomasMisses[userId] ?? []).includes(offset)) continue;
			out.push(checkIn(CIRCLES.thomas, userId, date, 1000, "monthly"));
		}
	}
	// month -1: all 5
	const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 12);
	for (const userId of ["u_you", "u_dad", "u_mom", "u_tomcy", "u_sarah"]) {
		out.push(checkIn(CIRCLES.thomas, userId, lastMonth, 1000, "monthly"));
	}
	// current month: you, mom, tomcy + dad yesterday (sarah due → streak at risk)
	for (const userId of ["u_you", "u_mom", "u_tomcy"]) {
		out.push(checkIn(CIRCLES.thomas, userId, now, 1000, "monthly"));
	}
	out.push(
		checkIn(
			CIRCLES.thomas,
			"u_dad",
			new Date(now.getTime() - 86400000),
			1000,
			"monthly",
		),
	);

	// Our Future — monthly, ₹4,000 each
	for (const offset of [-3, -2, -1]) {
		const date = new Date(now.getFullYear(), now.getMonth() + offset, 6);
		out.push(checkIn(CIRCLES.future, "u_you", date, 4000, "monthly"));
		out.push(checkIn(CIRCLES.future, "u_partner", date, 4000, "monthly"));
	}
	out.push(checkIn(CIRCLES.future, "u_you", now, 4000, "monthly"));
	out.push(
		checkIn(
			CIRCLES.future,
			"u_partner",
			new Date(now.getTime() - 86400000),
			4000,
			"monthly",
		),
	);

	// The Boys — daily, ₹100/day. days -7..-1 all four; today you + rahul
	for (let day = 1; day <= 7; day += 1) {
		const date = new Date(now.getTime() - day * 86400000);
		for (const userId of ["u_you", "u_rahul", "u_john", "u_arjun"]) {
			out.push(checkIn(CIRCLES.boys, userId, date, 100, "daily"));
		}
	}
	out.push(checkIn(CIRCLES.boys, "u_you", now, 100, "daily"));
	out.push(checkIn(CIRCLES.boys, "u_rahul", now, 100, "daily"));

	return out;
}

function buildNotifications(): Notification[] {
	return [
		notification(
			"u_you",
			"Sarah hasn't completed her investment",
			"Family ❤️ · your streak is at risk",
			"⚠️",
			hoursAgo(1),
		),
		notification(
			"u_you",
			"Rahul invested ₹100",
			"The Boys",
			"🔥",
			hoursAgo(2),
		),
		notification(
			"u_you",
			"Mom invested ₹1,000",
			"Family ❤️",
			"💰",
			hoursAgo(5),
			{ read: true },
		),
		notification(
			"u_you",
			"The Boys reached a 7-day streak",
			"The Boys",
			"🔥",
			hoursAgo(8),
			{ read: true },
		),
		notification(
			"u_you",
			"Family ❤️ crossed ₹25,000",
			"Family ❤️",
			"🎉",
			daysAgo(1),
			{ read: true },
		),
	];
}

export function buildSeed(): DB {
	return {
		users: USER_DIRECTORY,
		circles: allCircles,
		members: allMembers,
		checkIns: buildCheckIns(),
		notifications: buildNotifications(),
	};
}
