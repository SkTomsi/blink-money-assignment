import { vars } from "nativewind";
import tokens from "@blink/theme/tokens.json";

// "#RRGGBB" -> "R G B" channels (matches the conversion in tailwind.config.js).
const channels = (color: string): string => {
	if (color.startsWith("#")) {
		const hex = color.slice(1);
		const r = parseInt(hex.slice(0, 2), 16);
		const g = parseInt(hex.slice(2, 4), 16);
		const b = parseInt(hex.slice(4, 6), 16);
		return `${r} ${g} ${b}`;
	}
	return color;
};

const buildVars = (
	palette: Record<string, string>
): Record<`--color-${string}`, string> =>
	Object.fromEntries(
		Object.entries(palette).map(([key, value]) => [
			`--color-${key}`,
			channels(value),
		]),
	) as Record<`--color-${string}`, string>;

export const lightVars = vars(buildVars(tokens.light));
export const darkVars = vars(buildVars(tokens.dark));