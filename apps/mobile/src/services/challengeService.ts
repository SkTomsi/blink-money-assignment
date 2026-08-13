import type { Challenge, DB, ChallengeType } from "../types";
import { ApiError } from "../types";
import { addDays } from "../lib/dates";
import { uid } from "../lib/ids";

const CHALLENGE_DEFS: Record<
	ChallengeType,
	{ title: string; target: number; days: number }
> = {
	"7-day": { title: "Invest every day for 7 days", target: 7, days: 7 },
	"30-day": { title: "Invest every day for 30 days", target: 30, days: 30 },
	"10k": { title: "₹10K Challenge", target: 10000, days: 30 },
	"step-up": { title: "Step-Up Challenge", target: 30, days: 30 },
};

export function createChallenge(
	db: DB,
	circleId: string,
	type: ChallengeType
): { db: DB; challenge: Challenge } {
	const circle = db.circles.find((c) => c.id === circleId);
	if (!circle) {
		throw new ApiError("NOT_FOUND", "Circle not found");
	}
	const def = CHALLENGE_DEFS[type];
	const start = new Date();
	const challenge: Challenge = {
		id: uid("ch"),
		circleId,
		type,
		title: def.title,
		target: def.target,
		startDate: start.toISOString(),
		endDate: addDays(start, def.days).toISOString(),
		status: "active",
	};
	return {
		db: { ...db, challenges: [...db.challenges, challenge] },
		challenge,
	};
}

export function completeChallenge(
	db: DB,
	challengeId: string
): { db: DB; challenge: Challenge } {
	const challenge = db.challenges.find((c) => c.id === challengeId);
	if (!challenge) {
		throw new ApiError("NOT_FOUND", "Challenge not found");
	}
	const updated: Challenge = { ...challenge, status: "completed" };
	return {
		db: {
			...db,
			challenges: db.challenges.map((c) =>
				c.id === challengeId ? updated : c
			),
		},
		challenge: updated,
	};
}

export function getActiveChallenges(db: DB, circleId: string): Challenge[] {
	return db.challenges.filter(
		(c) => c.circleId === circleId && c.status === "active"
	);
}