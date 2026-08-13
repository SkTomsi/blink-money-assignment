import { daysAgo, hoursAgo, monthsAgo, periodKeyFor } from "../lib/dates";
import { uid } from "../lib/ids";
import type {
	Activity,
	Challenge,
	CheckIn,
	Circle,
	CircleMember,
	DB,
	Notification,
} from "../types";
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
		contributionAmount: 0,
		status: "active",
		showContribution: false,
		joinedAt: monthsAgo(2),
		...overrides,
	};
}

function activity(
	circleId: string,
	userId: string,
	type: Activity["type"],
	createdAt: string,
	overrides: Partial<Activity> = {},
): Activity {
	return {
		id: uid("a"),
		circleId,
		userId,
		type,
		reactions: {},
		createdAt,
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
		goal: "Family Wealth",
		goalEmoji: "🏡",
		targetAmount: 100000,
		targetDate: "2027-12-31T00:00:00.000Z",
		frequency: "monthly",
		contributionMode: "equal",
		defaultAmount: 1000,
		groupTarget: null,
		inviteSlug: "family",
		createdAt: monthsAgo(8),
	},
	{
		id: CIRCLES.future,
		name: "Future Goals💛",
		type: "couple",
		ownerId: "u_you",
		goal: "Home",
		goalEmoji: "🏠",
		targetAmount: 5000000,
		targetDate: "2028-12-31T00:00:00.000Z",
		frequency: "monthly",
		contributionMode: "individual",
		defaultAmount: 0,
		groupTarget: null,
		inviteSlug: "our-future",
		createdAt: monthsAgo(4),
	},
	{
		id: CIRCLES.boys,
		name: "The Boys",
		type: "friends",
		ownerId: "u_you",
		goal: "Build a consistent habit",
		goalEmoji: "🎯",
		targetAmount: 5000,
		targetDate: new Date(
			new Date().setMonth(new Date().getMonth() + 2),
		).toISOString(),
		frequency: "daily",
		contributionMode: "individual",
		defaultAmount: 100,
		groupTarget: null,
		inviteSlug: "the-boys",
		createdAt: daysAgo(14),
	},
];

const allMembers: CircleMember[] = [
	// Thomas Family — you(owner), dad, mom, tomcy, sarah (all active)
	member(CIRCLES.thomas, "u_you", {
		role: "owner",
		contributionAmount: 1000,
		showContribution: true,
		joinedAt: monthsAgo(8),
	}),
	member(CIRCLES.thomas, "u_dad", {
		contributionAmount: 1000,
		joinedAt: monthsAgo(7),
	}),
	member(CIRCLES.thomas, "u_mom", {
		contributionAmount: 1000,
		joinedAt: monthsAgo(7),
	}),
	member(CIRCLES.thomas, "u_tomcy", {
		contributionAmount: 1000,
		joinedAt: monthsAgo(5),
	}),
	member(CIRCLES.thomas, "u_sarah", {
		contributionAmount: 1000,
		joinedAt: monthsAgo(2),
	}),
	// Our Future — you + partner
	member(CIRCLES.future, "u_you", {
		role: "owner",
		contributionAmount: 5000,
		showContribution: true,
		joinedAt: monthsAgo(4),
	}),
	member(CIRCLES.future, "u_partner", {
		contributionAmount: 3000,
		showContribution: true,
		joinedAt: monthsAgo(4),
	}),
	// The Boys — you, rahul, john, arjun active; maya invited
	member(CIRCLES.boys, "u_you", {
		role: "owner",
		contributionAmount: 100,
		showContribution: true,
		joinedAt: daysAgo(14),
	}),
	member(CIRCLES.boys, "u_rahul", {
		contributionAmount: 100,
		showContribution: true,
		joinedAt: daysAgo(14),
	}),
	member(CIRCLES.boys, "u_john", {
		contributionAmount: 100,
		showContribution: true,
		joinedAt: daysAgo(12),
	}),
	member(CIRCLES.boys, "u_arjun", {
		contributionAmount: 100,
		showContribution: true,
		joinedAt: daysAgo(10),
	}),
	member(CIRCLES.boys, "u_maya", {
		contributionAmount: 100,
		status: "invited",
		joinedAt: daysAgo(2),
	}),
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
	// current month: you, dad, mom, tomcy (sarah due → streak at risk)
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

	// Our Future — monthly, individual (you 5000 / partner 3000)
	for (const offset of [-3, -2, -1]) {
		const date = new Date(now.getFullYear(), now.getMonth() + offset, 6);
		out.push(checkIn(CIRCLES.future, "u_you", date, 5000, "monthly"));
		out.push(checkIn(CIRCLES.future, "u_partner", date, 3000, "monthly"));
	}
	out.push(checkIn(CIRCLES.future, "u_you", now, 5000, "monthly"));
	out.push(
		checkIn(
			CIRCLES.future,
			"u_partner",
			new Date(now.getTime() - 86400000),
			3000,
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

function buildActivities(): Activity[] {
	const out: Activity[] = [];

	// Thomas Family
	out.push(
		activity(CIRCLES.thomas, "u_you", "goal_created", monthsAgo(8), {
			metadata: { title: "Family Wealth" },
		}),
	);
	out.push(activity(CIRCLES.thomas, "u_dad", "member_joined", monthsAgo(7)));
	out.push(activity(CIRCLES.thomas, "u_mom", "member_joined", monthsAgo(7)));
	out.push(activity(CIRCLES.thomas, "u_tomcy", "member_joined", monthsAgo(5)));
	out.push(activity(CIRCLES.thomas, "u_sarah", "member_joined", monthsAgo(2)));
	out.push(
		activity(CIRCLES.thomas, "u_you", "milestone", monthsAgo(3), {
			metadata: { milestone: "₹25K", title: "Thomas Family crossed ₹25,000" },
			reactions: { "🚀": ["u_you", "u_dad"] },
		}),
	);
	out.push(
		activity(CIRCLES.thomas, "u_tomcy", "contribution_completed", daysAgo(2), {
			amount: 1000,
			reactions: { "❤️": ["u_you"] },
		}),
	);
	out.push(
		activity(CIRCLES.thomas, "u_dad", "contribution_completed", daysAgo(1), {
			amount: 1000,
			reactions: { "❤️": ["u_you", "u_mom"], "🔥": ["u_tomcy"] },
		}),
	);
	out.push(
		activity(CIRCLES.thomas, "u_you", "investment", daysAgo(1), {
			amount: 1000,
		}),
	);
	out.push(
		activity(CIRCLES.thomas, "u_mom", "investment", daysAgo(1), {
			amount: 1000,
			reactions: { "👏": ["u_you"] },
		}),
	);
	// borrowing + repayment (no amounts — PRD §14)
	out.push(activity(CIRCLES.thomas, "u_tomcy", "borrowing", daysAgo(4)));
	out.push(activity(CIRCLES.thomas, "u_tomcy", "repayment", daysAgo(3)));

	// Our Future
	out.push(
		activity(CIRCLES.future, "u_you", "goal_created", monthsAgo(4), {
			metadata: { title: "Home" },
		}),
	);
	out.push(
		activity(CIRCLES.future, "u_you", "investment_increment", monthsAgo(2), {
			metadata: { from: 4000, to: 5000 },
		}),
	);
	out.push(
		activity(
			CIRCLES.future,
			"u_partner",
			"contribution_completed",
			daysAgo(1),
			{
				amount: 3000,
				reactions: { "❤️": ["u_you"], "👏": ["u_you"] },
			},
		),
	);
	out.push(
		activity(CIRCLES.future, "u_you", "investment", daysAgo(1), {
			amount: 5000,
		}),
	);

	// The Boys
	out.push(
		activity(CIRCLES.boys, "u_you", "challenge_completed", daysAgo(1), {
			metadata: { challenge: "7-Day Challenge" },
			reactions: { "🚀": ["u_you", "u_rahul", "u_john", "u_arjun"] },
		}),
	);
	out.push(
		activity(CIRCLES.boys, "u_you", "streak", daysAgo(1), {
			metadata: { title: "The circle reached a 7-day streak" },
			reactions: { "🔥": ["u_you", "u_rahul"] },
		}),
	);
	out.push(
		activity(CIRCLES.boys, "u_john", "investment", daysAgo(1), {
			amount: 100,
		}),
	);
	out.push(
		activity(CIRCLES.boys, "u_arjun", "investment", daysAgo(1), {
			amount: 100,
			reactions: { "👏": ["u_you"] },
		}),
	);
	out.push(
		activity(CIRCLES.boys, "u_you", "investment", hoursAgo(2), {
			amount: 100,
		}),
	);
	out.push(
		activity(CIRCLES.boys, "u_rahul", "investment", hoursAgo(1), {
			amount: 100,
			reactions: { "🔥": ["u_you"] },
		}),
	);

	return out;
}

function buildChallenges(): Challenge[] {
	return [
		{
			id: uid("ch"),
			circleId: CIRCLES.boys,
			type: "7-day",
			title: "Invest every day for 7 days",
			target: 7,
			startDate: daysAgo(8),
			endDate: daysAgo(1),
			status: "completed",
		},
		{
			id: uid("ch"),
			circleId: CIRCLES.thomas,
			type: "10k",
			title: "₹10K Challenge — invest ₹10,000 together",
			target: 10000,
			startDate: daysAgo(6),
			endDate: new Date(
				new Date().setDate(new Date().getDate() + 8),
			).toISOString(),
			status: "active",
		},
	];
}

function buildNotifications(): Notification[] {
	return [
		notification(
			"u_you",
			"Sarah hasn't completed her investment",
			"Thomas Family · your streak is at risk",
			"⚠️",
			hoursAgo(1),
			{ circleId: CIRCLES.thomas },
		),
		notification(
			"u_you",
			"Rahul invested ₹100",
			"The Boys",
			"🔥",
			hoursAgo(2),
			{ circleId: CIRCLES.boys },
		),
		notification(
			"u_you",
			"Mom invested ₹1,000",
			"Thomas Family",
			"💰",
			hoursAgo(5),
			{ circleId: CIRCLES.thomas, read: true },
		),
		notification(
			"u_you",
			"The Boys reached a 7-day streak",
			"The Boys",
			"🔥",
			hoursAgo(8),
			{ circleId: CIRCLES.boys, read: true },
		),
		notification(
			"u_you",
			"Thomas Family crossed ₹25,000",
			"Thomas Family",
			"🎉",
			daysAgo(1),
			{ circleId: CIRCLES.thomas, read: true },
		),
	];
}

export function buildSeed(): DB {
	return {
		users: USER_DIRECTORY,
		circles: allCircles,
		members: allMembers,
		activities: buildActivities(),
		checkIns: buildCheckIns(),
		challenges: buildChallenges(),
		notifications: buildNotifications(),
	};
}
