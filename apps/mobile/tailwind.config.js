/** @type {import('tailwindcss').Config} */
const light = {
	bg: "#F7F9F4",
	bgElevated: "#FFFFFF",
	surface: "#FFFFFF",
	surfaceAlt: "#F0F3EA",
	border: "#E3E8DA",
	borderBright: "#CBD6BD",
	primary: "#4E7A2E",
	primaryDim: "#7CCB4E",
	primaryDeep: "#3A5E22",
	yellow: "#A87B1E",
	yellowDeep: "#8F6A15",
	gray: "#7C877F",
	grayDeep: "#AEB8B0",
	blue: "#3D7FD9",
	blueDeep: "#2B62B0",
	red: "#D9483C",
	redDeep: "#B23C33",
	textPrimary: "#151B11",
	textSecondary: "#4C5646",
	textMuted: "#8A9584",
	white: "#FFFFFF",
	black: "#000000",
};

const dark = {
	bg: "#0A0E08",
	bgElevated: "#10150C",
	surface: "#161D10",
	surfaceAlt: "#1C2514",
	border: "#27321C",
	borderBright: "#3A4A28",
	primary: "#9FE870",
	primaryDim: "#7CCB4E",
	primaryDeep: "#4E7A2E",
	yellow: "#F2C14E",
	yellowDeep: "#B98A22",
	gray: "#9BA8A2",
	grayDeep: "#5C6A62",
	blue: "#6FB8FF",
	blueDeep: "#3D7FD9",
	red: "#FF6B5E",
	redDeep: "#C24A3E",
	textPrimary: "#F2F7EC",
	textSecondary: "#A7B39A",
	textMuted: "#6E7A63",
	white: "#FFFFFF",
	black: "#000000",
};

const toColors = (p) =>
	Object.fromEntries(Object.entries(p).map(([k, v]) => [k, v]));

module.exports = {
	// NOTE: Update this to include the paths to all files that contain Nativewind classes.
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				...toColors(light),
				...Object.fromEntries(
					Object.entries(dark).map(([k, v]) => [`${k}Dark`, v])
				),
			},
		},
	},
	plugins: [],
};