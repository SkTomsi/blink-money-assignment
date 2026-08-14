import { Ionicons } from "@expo/vector-icons";
import { colors, colorsLight } from "@blink/theme";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

export function StepperHeader({
	title,
	subtitle,
	step,
	total,
	canGoBack = true,
	onBack,
}: {
	title: string;
	subtitle: string;
	step: number;
	total: number;
	canGoBack?: boolean;
	onBack?: () => void;
}) {
	const router = useRouter();
	const { isDark } = useTheme();
	const iconColor = isDark ? colors.textMuted : colorsLight.textMuted;

	const handleBack = () => {
		if (onBack) {
			onBack();
		} else {
			router.back();
		}
	};

	return (
		<View className="gap-3 px-5 pb-3 pt-2">
			<View className="flex-row items-center gap-2">
				{canGoBack ? (
					<Pressable
						onPress={handleBack}
						hitSlop={12}
						className="h-10 w-10 items-center justify-center rounded-xl bg-surface"
						style={({ pressed }) =>
							pressed && { transform: [{ scale: 0.94 }], opacity: 0.8 }
						}
					>
						<Ionicons name="chevron-back" size={22} color={iconColor} />
					</Pressable>
				) : (
					<View className="h-10 w-10" />
				)}
				<View className="flex-1">
					<Text className="text-h2 text-textPrimary">{title}</Text>
					<Text className="mt-0.5 text-body text-textSecondary">
						{subtitle}
					</Text>
				</View>
			</View>
			<View className="flex-row gap-1.5">
				{Array.from({ length: total }).map((_, i) => (
					<View
						key={i}
						className={`h-1 flex-1 rounded-full ${
							i <= step ? "bg-primary" : "bg-border"
						}`}
					/>
				))}
			</View>
		</View>
	);
}