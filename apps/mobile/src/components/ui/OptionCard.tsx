import { Pressable, Text, View } from "react-native";

export function OptionCard({
	emoji,
	title,
	description,
	selected,
	onPress,
}: {
	emoji: string;
	title: string;
	description: string;
	selected: boolean;
	onPress: () => void;
}) {
	return (
		<Pressable
			onPress={onPress}
			className={`flex-row items-center gap-3 rounded-2xl border p-4 ${
				selected ? "border-primary bg-primarySoft" : "border-border bg-surface"
			}`}
			style={({ pressed }) => pressed && { transform: [{ scale: 0.98 }] }}
		>
			<View className="h-12 w-12 items-center justify-center rounded-xl bg-bg">
				<Text className="text-2xl">{emoji}</Text>
			</View>
			<View className="flex-1">
				<Text className="text-body font-semibold text-textPrimary">
					{title}
				</Text>
				<Text className="mt-0.5 text-caption text-textSecondary">
					{description}
				</Text>
			</View>
			<View
				className={`h-5 w-5 items-center justify-center rounded-full border ${
					selected ? "border-primary bg-primary" : "border-borderBright"
				}`}
			>
				{selected ? <Text className="text-[11px] font-bold text-onPrimary">✓</Text> : null}
			</View>
		</Pressable>
	);
}