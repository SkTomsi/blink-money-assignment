export type CircleType = "family" | "couple" | "friends";
export type Frequency = "daily" | "monthly";
export type ContributionMode = "equal" | "individual" | "group-target";
export type MemberStatus = "active" | "invited" | "pending";
export type MemberRole = "owner" | "member";

export type User = {
	id: string;
	username: string;
	name: string;
	avatarColor: string;
};

export type Circle = {
	id: string;
	name: string;
	type: CircleType;
	ownerId: string;
	goal: string;
	goalEmoji: string;
	targetAmount: number;
	targetDate: string;
	frequency: Frequency;
	contributionMode: ContributionMode;
	defaultAmount: number;
	groupTarget: number | null;
	inviteSlug: string;
	createdAt: string;
};

export type CircleMember = {
	id: string;
	circleId: string;
	userId: string;
	role: MemberRole;
	contributionAmount: number;
	status: MemberStatus;
	showContribution: boolean;
	joinedAt: string;
};

export type ActivityType =
	| "investment"
	| "contribution_completed"
	| "investment_increment"
	| "milestone"
	| "streak"
	| "member_joined"
	| "challenge_completed"
	| "borrowing"
	| "repayment"
	| "goal_created";

export const REACTION_EMOJIS = ["❤️", "🔥", "👏", "🚀"] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];

export type Activity = {
	id: string;
	circleId: string;
	userId: string;
	type: ActivityType;
	amount?: number;
	metadata?: {
		title?: string;
		from?: number;
		to?: number;
		milestone?: string;
		challenge?: string;
	};
	reactions: Partial<Record<ReactionEmoji, string[]>>;
	createdAt: string;
};

export type CheckIn = {
	id: string;
	circleId: string;
	userId: string;
	periodKey: string;
	amount: number;
	createdAt: string;
};

export type ChallengeType = "7-day" | "30-day" | "10k" | "step-up";
export type ChallengeStatus = "active" | "completed" | "expired";

export type Challenge = {
	id: string;
	circleId: string;
	type: ChallengeType;
	title: string;
	target: number;
	startDate: string;
	endDate: string;
	status: ChallengeStatus;
};

export type Notification = {
	id: string;
	userId: string;
	circleId?: string;
	title: string;
	body: string;
	icon: string;
	read: boolean;
	createdAt: string;
};

export type ApiErrorCode =
	| "OFFLINE"
	| "DUPLICATE_MEMBER"
	| "NOT_FOUND"
	| "VALIDATION";

export class ApiError extends Error {
	code: ApiErrorCode;

	constructor(code: ApiErrorCode, message: string) {
		super(message);
		this.name = "ApiError";
		this.code = code;
	}
}

export type DB = {
	users: User[];
	circles: Circle[];
	members: CircleMember[];
	activities: Activity[];
	checkIns: CheckIn[];
	challenges: Challenge[];
	notifications: Notification[];
};