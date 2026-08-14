import type { CircleType, Frequency } from "@/types";

export type Draft = {
	type: CircleType | null;
	name: string;
	contribution: string;
	frequency: Frequency;
	durationMonths: number;
	memberIds: string[];
	query: string;
};

export function createDraft(): Draft {
	return {
		type: null,
		name: "",
		contribution: "",
		frequency: "monthly",
		durationMonths: 24,
		memberIds: [],
		query: "",
	};
}

export function parseAmount(value: string): number {
	const digits = value.replace(/[^\d]/g, "");
	return digits ? parseInt(digits, 10) : 0;
}
