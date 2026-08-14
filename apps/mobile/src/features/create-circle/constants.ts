import type { CircleType, Frequency } from "@/types";
import { parseAmount, type Draft } from "./draft";

export const FORM_STEPS = 4;
export const SUCCESS_STEP = FORM_STEPS;

export const TYPES: {
	key: CircleType;
	emoji: string;
	title: string;
	description: string;
}[] = [
	{
		key: "family",
		emoji: "🏡",
		title: "Family",
		description: "Build wealth together as a family",
	},
	{
		key: "couple",
		emoji: "💛",
		title: "Couple",
		description: "Build your future together",
	},
	{
		key: "friends",
		emoji: "🤝",
		title: "Friends",
		description: "Build a better investing habit",
	},
];

export const DURATIONS = [
	{ months: 12, label: "1 year" },
	{ months: 24, label: "2 years" },
	{ months: 36, label: "3 years" },
	{ months: 60, label: "5 years" },
];

export const NAME_SUGGESTIONS: Record<CircleType, string[]> = {
	family: ["Thomas Family", "The Kapoors", "Home Sweet Home"],
	couple: ["Our Future", "Us Two", "Adventure Partners"],
	friends: ["The Boys", "Goa 2027", "Dream Team"],
};

export const STEP_META = [
	{ title: "Choose circle type", subtitle: "Who are you investing with?" },
	{ title: "Name your circle", subtitle: "Give it a name that means something" },
	{
		title: "Set up your investment",
		subtitle: "One amount, everyone invests the same",
	},
	{ title: "Add people", subtitle: "Invite people you trust" },
];

export function periodLabel(frequency: Frequency): string {
	return frequency === "daily" ? "per day" : "per month";
}

export function periodUnit(frequency: Frequency): string {
	return frequency === "daily" ? "day" : "month";
}

export function monthYearLabel(iso: string): string {
	return new Date(iso).toLocaleDateString("en-IN", {
		month: "short",
		year: "numeric",
	});
}

export function slugOf(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

export function canContinue(draft: Draft, step: number): boolean {
	switch (step) {
		case 0:
			return draft.type !== null;
		case 1:
			return draft.name.trim().length >= 2;
		case 2:
			return parseAmount(draft.contribution) > 0;
		default:
			return true;
	}
}
