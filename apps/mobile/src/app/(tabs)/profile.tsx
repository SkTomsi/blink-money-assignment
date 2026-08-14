import { colors, colorsLight } from "@blink/theme";
import { useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { CURRENT_USER } from "@/data/users";
import { useCircleStore } from "@/store/useCircleStore";
import { type ThemePreference, useTheme } from "@/theme/ThemeProvider";

const THEME_OPTIONS: { key: ThemePreference; label: string }[] = [
	{ key: "system", label: "System" },
	{ key: "light", label: "Light" },
	{ key: "dark", label: "Dark" },
];

export default function ProfileScreen() {
	const { isDark, preference, setPreference } = useTheme();
	const offline = useCircleStore((s) => s.offline);
	const setOffline = useCircleStore((s) => s.setOffline);
	const reseed = useCircleStore((s) => s.reseed);
	const [resetting, setResetting] = useState(false);
	const pal = isDark ? colors : colorsLight;

	const onReset = async () => {
		setResetting(true);
		await reseed();
		setResetting(false);
	};

	return (
		<Screen>
			<View className="gap-4">
				<ScreenHeader title="Profile" subtitle="Your world, your settings" />

				<View className="mx-5 flex-row items-center gap-3 rounded-2xl bg-surface p-4">
					<Avatar
						color={CURRENT_USER.avatarColor}
						name={CURRENT_USER.name}
						size={48}
					/>
					<View className="flex-1">
						<Text className="text-h4 text-textPrimary">
							{CURRENT_USER.name}
						</Text>
						<Text className="text-caption text-textMuted">
							{CURRENT_USER.username}
						</Text>
					</View>
					<View className="rounded-full bg-primarySoft px-2.5 py-1">
						<Text className="text-micro font-semibold text-primaryDeep">
							Member
						</Text>
					</View>
				</View>

				<View className="mx-5 rounded-2xl bg-surface p-4">
					<Text className="mb-3 text-caption font-semibold uppercase tracking-wide text-textMuted">
						Appearance
					</Text>
					<View className="flex-row gap-2">
						{THEME_OPTIONS.map((option) => {
							const active = preference === option.key;
							return (
								<Pressable
									key={option.key}
									onPress={() => setPreference(option.key)}
									className={`flex-1 items-center rounded-xl border py-2.5 ${
										active
											? "border-primary bg-primarySoft"
											: "border-border bg-bg"
									}`}
									style={({ pressed }) =>
										pressed && { transform: [{ scale: 0.97 }] }
									}
								>
									<Text
										className={`text-caption font-semibold ${
											active ? "text-primaryDeep" : "text-textSecondary"
										}`}
									>
										{option.label}
									</Text>
								</Pressable>
							);
						})}
					</View>
				</View>

				<View className="mx-5 rounded-2xl bg-surface p-4">
					<Text className="mb-3 text-caption font-semibold uppercase tracking-wide text-textMuted">
						Prototype
					</Text>
					<Pressable
						onPress={onReset}
						disabled={resetting}
						className="items-center rounded-xl border border-border bg-bg py-3"
						style={({ pressed }) => pressed && { transform: [{ scale: 0.98 }] }}
					>
						<Text className="text-body font-semibold text-textPrimary">
							{resetting ? "Resetting…" : "Reset demo data"}
						</Text>
					</Pressable>
					<Text className="mt-5 text-center text-micro text-textMuted">
						Wealth Circle prototype · mock data stored locally
					</Text>
				</View>
			</View>
		</Screen>
	);
}
