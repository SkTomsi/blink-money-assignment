import type { Activity, DB, ReactionEmoji } from "../types";
import { ApiError, REACTION_EMOJIS } from "../types";

export function toggleReaction(
	db: DB,
	activityId: string,
	userId: string,
	emoji: ReactionEmoji,
): { db: DB; activity: Activity } {
	if (!REACTION_EMOJIS.includes(emoji)) {
		throw new ApiError("VALIDATION", "Unsupported reaction");
	}
	const activity = db.activities.find((a) => a.id === activityId);
	if (!activity) {
		throw new ApiError("NOT_FOUND", "Activity not found");
	}
	const reactions = { ...activity.reactions };
	const users = new Set(reactions[emoji] ?? []);
	if (users.has(userId)) {
		users.delete(userId);
	} else {
		users.add(userId);
	}
	if (users.size === 0) {
		delete reactions[emoji];
	} else {
		reactions[emoji] = [...users];
	}
	const updated: Activity = { ...activity, reactions };
	return {
		db: {
			...db,
			activities: db.activities.map((a) => (a.id === activityId ? updated : a)),
		},
		activity: updated,
	};
}
