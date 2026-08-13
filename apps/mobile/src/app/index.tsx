import { Pressable, Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

export default function App() {
	const { isDark, toggle } = useTheme();

	return (
		<View className="flex-1 bg-bg px-6 pt-16">
			<View className="gap-6">
				<View className="gap-1">
					<Text className="text-caption font-semibold uppercase tracking-wide text-textMuted">
						Phase 0 · Foundation
					</Text>
					<Text className="text-h2 font-extrabold text-textPrimary">
						Wealth Circle
					</Text>
					<Text className="text-body text-textSecondary">
						Theme tokens + dark/light mode are wired. Ready for the next phase.
					</Text>
				</View>

				<View className="rounded-lg bg-surface p-4">
					<View className="h-2 w-2/3 rounded-full bg-primary" />
					<Text className="mt-4 text-h4 font-bold text-primary">
						₹42,000 / ₹1,00,000
					</Text>
					<Text className="mt-1 text-caption text-textMuted">
						42% · 18 day streak
					</Text>
				</View>

				<Pressable
					onPress={toggle}
					className="items-center rounded-md bg-primary py-3.5"
				>
					<Text className="font-bold">Switch to {isDark ? "light" : "dark"} mode</Text>
				</Pressable>
			</View>
		</View>
	);
}