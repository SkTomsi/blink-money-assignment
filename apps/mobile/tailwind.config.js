/** @type {import('tailwindcss').Config} */
// Shared palette source of truth (see packages/theme/tokens.json).
const { light } = require("@blink/theme/tokens.json");

// "#RRGGBB" -> "R G B" so tokens can back `rgb(var(--color-x) / <alpha-value>)`.
const channels = (color) => {
	if (color.startsWith("#")) {
		const hex = color.slice(1);
		const r = parseInt(hex.slice(0, 2), 16);
		const g = parseInt(hex.slice(2, 4), 16);
		const b = parseInt(hex.slice(4, 6), 16);
		return `${r} ${g} ${b}`;
	}
	return color;
};

// Semantic token names resolve to CSS variables. Solid colors keep the
// `<alpha-value>` slot so opacity modifiers like `bg-primary/20` work.
const toColors = (palette) =>
	Object.fromEntries(
		Object.entries(palette).map(([key, value]) => [
			key,
			value.startsWith("#")
				? `rgb(var(--color-${key}) / <alpha-value>)`
				: `var(--color-${key})`,
		]),
	);

// Default variable values on `:root` — the light theme before any `vars()` apply.
const toVars = (palette) =>
	Object.fromEntries(
		Object.entries(palette).map(([key, value]) => [
			`--color-${key}`,
			channels(value),
		]),
	);

module.exports = {
	// NOTE: Update this to include the paths to all files that contain Nativewind classes.
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	darkMode: "class",
	theme: {
		extend: {
			colors: toColors(light),
		},
	},
	plugins: [
		({ addBase }) =>
			addBase({
				":root": toVars(light),
			}),
	],
};