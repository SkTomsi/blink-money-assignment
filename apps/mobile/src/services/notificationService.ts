import type { DB, Notification } from "../types";
import { ApiError } from "../types";

export function markRead(
	db: DB,
	userId: string,
	notificationId: string,
): { db: DB; notification: Notification } {
	const notification = db.notifications.find((n) => n.id === notificationId);
	if (!notification || notification.userId !== userId) {
		throw new ApiError("NOT_FOUND", "Notification not found");
	}
	const updated: Notification = { ...notification, read: true };
	return {
		db: {
			...db,
			notifications: db.notifications.map((n) =>
				n.id === notificationId ? updated : n,
			),
		},
		notification: updated,
	};
}

export function markAllRead(db: DB, userId: string): { db: DB; count: number } {
	let count = 0;
	const notifications = db.notifications.map((n) => {
		if (n.userId === userId && !n.read) {
			count += 1;
			return { ...n, read: true };
		}
		return n;
	});
	return { db: { ...db, notifications }, count };
}
