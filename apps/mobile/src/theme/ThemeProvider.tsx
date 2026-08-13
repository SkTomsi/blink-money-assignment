import { colors, colorsLight } from "@blink/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useColorScheme } from "nativewind";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

export type ThemePreference = "system" | "light" | "dark";

type ThemeContextValue = {
	preference: ThemePreference;
	isDark: boolean;
	setPreference: (preference: ThemePreference) => void;
	toggle: () => void;
};

const STORAGE_KEY = "blink.theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function isPreference(value: unknown): value is ThemePreference {
	return value === "system" || value === "light" || value === "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const { colorScheme, setColorScheme } = useColorScheme();
	const [preference, setPreferenceState] = useState<ThemePreference>("system");

	useEffect(() => {
		AsyncStorage.getItem(STORAGE_KEY)
			.then((value) => {
				if (isPreference(value)) setPreferenceState(value);
			})
			.catch(() => {});
	}, []);

	const isDark = colorScheme === "dark";

	useEffect(() => {
		setColorScheme(preference);
	}, [preference, setColorScheme]);

	useEffect(() => {
		SystemUI.setBackgroundColorAsync(isDark ? colors.bg : colorsLight.bg).catch(
			() => {},
		);
	}, [isDark]);

	const value = useMemo<ThemeContextValue>(
		() => ({
			preference,
			isDark,
			setPreference: (next) => {
				setPreferenceState(next);
				AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
			},
			toggle: () => {
				const next = isDark ? "light" : "dark";
				setPreferenceState(next);
				AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
			},
		}),
		[preference, isDark],
	);

	return (
		<ThemeContext.Provider value={value}>
			<StatusBar style={isDark ? "light" : "dark"} />
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
