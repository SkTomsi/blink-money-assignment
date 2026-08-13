import type { DB, User } from "../types";

export function getUserById(db: DB, userId: string): User | undefined {
	return db.users.find((u) => u.id === userId);
}

export function searchUsers(db: DB, query: string, excludeIds: string[] = []): User[] {
	const q = query.trim().toLowerCase();
	if (!q) return [];
	return db.users.filter(
		(u) =>
			!excludeIds.includes(u.id) &&
			(u.name.toLowerCase().includes(q) ||
				u.username.toLowerCase().includes(q))
	);
}