import type { User } from "../types";

export const CURRENT_USER: User = {
	id: "u_me",
	username: "@you",
	name: "You",
	avatarColor: "#4E7A2E",
};

export const USER_DIRECTORY: User[] = [
	CURRENT_USER,
	{ id: "u_dad", username: "@dad", name: "Dad", avatarColor: "#3D7FD9" },
	{ id: "u_mom", username: "@mom", name: "Mom", avatarColor: "#B98A22" },
	{ id: "u_sarah", username: "@sarah", name: "Sarah", avatarColor: "#7CCB4E" },
	{
		id: "u_partner",
		username: "@partner",
		name: "Partner",
		avatarColor: "#2B62B0",
	},
	{ id: "u_rahul", username: "@rahul", name: "Rahul", avatarColor: "#3A5E22" },
	{ id: "u_john", username: "@john", name: "John", avatarColor: "#8F6A15" },
	{ id: "u_arjun", username: "@arjun", name: "Arjun", avatarColor: "#5C6A62" },
	{ id: "u_maya", username: "@maya", name: "Maya", avatarColor: "#A87B1E" },
];
