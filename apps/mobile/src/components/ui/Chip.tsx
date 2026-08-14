import { Pressable, Text } from "react-native";

export function Chip({
	label,
	selected,
	onPress,
}: {
	label: string;
	selected?: boolean;
	onPress?: () => void;
}) {
	return (
		<Pressable
			onPress={onPress}
			disabled={!onPress}
			className={`rounded-full border px-3.5 py-2 ${
				selected
					? "border-primary bg-primarySoft"
					: "border-border bg-surface"
			}`}
			style={({ pressed }) =>
				pressed && { transform: [{ scale: 0.96 }] }
			}
		>
			<Text
				className={`text-caption font-medium ${
					selected ? "text-primary" : "text-textSecondary"
				}`}
			>
				{label}
			</Text>
		</Pressable>
	);
}