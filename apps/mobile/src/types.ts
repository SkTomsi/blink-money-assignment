export type CircleType = "family" | "couple" | "friends";
export type Frequency = "daily" | "monthly";
export type MemberStatus = "active" | "invited";
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
	frequency: Frequency;
	/** Per-period contribution, same for everyone in the circle. */
	contributionAmount: number;
	durationMonths: number;
	/** Total = contribution × periods. */
	targetAmount: number;
	targetDate: string;
	inviteSlug: string;
	createdAt: string;
};

export type CircleMember = {
	id: string;
	circleId: string;
	userId: string;
	role: MemberRole;
	status: MemberStatus;
	joinedAt: string;
};

export type CheckIn = {
	id: string;
	circleId: string;
	userId: string;
	periodKey: string;
	amount: number;
	createdAt: string;
};

export type Notification = {
	id: string;
	userId: string;
	title: string;
	body: string;
	icon: string;
	read: boolean;
	createdAt: string;
};

export type ApiErrorCode = "VALIDATION" | "NOT_FOUND" | "DUPLICATE_MEMBER";

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
	checkIns: CheckIn[];
	notifications: Notification[];
};
