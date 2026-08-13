import { Ionicons } from "@expo/vector-icons";
import { colors, colorsLight } from "@blink/theme";
import { useRouter } from "expo-router";
import { type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

export function ScreenHeader({
	title,
	subtitle,
	right,
	back = false,
}: {
	title: string;
	subtitle?: string;
	right?: ReactNode;
	back?: boolean;
}) {
	const router = useRouter();
	const { isDark } = useTheme();
	const iconColor = isDark ? colors.textMuted : colorsLight.textMuted;

	return (
		<View className="flex-row items-center justify-between px-5 pb-3 pt-2">
			<View className="flex-1 flex-row items-center gap-2">
				{back ? (
					<Pressable
						onPress={() => router.back()}
						hitSlop={12}
						className="h-10 w-10 items-center justify-center rounded-xl bg-surface"
						style={({ pressed }) =>
							pressed && { transform: [{ scale: 0.94 }], opacity: 0.8 }
						}
					>
						<Ionicons name="chevron-back" size={22} color={iconColor} />
					</Pressable>
				) : null}
				<View className="flex-1">
					<Text className="text-h2 text-textPrimary">{title}</Text>
					{subtitle ? (
						<Text className="mt-0.5 text-body text-textSecondary">{subtitle}</Text>
					) : null}
				</View>
			</View>
			{right}
		</View>
	);
}