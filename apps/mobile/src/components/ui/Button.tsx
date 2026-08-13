import { Pressable, Text } from "react-native";

export function Button({
	label,
	onPress,
	variant = "primary",
	disabled = false,
}: {
	label: string;
	onPress: () => void;
	variant?: "primary" | "secondary";
	disabled?: boolean;
}) {
	return (
		<Pressable
			onPress={onPress}
			disabled={disabled}
			className={`items-center justify-center rounded-xl px-5 py-3.5 ${
				variant === "primary" ? "bg-primary" : "border border-border bg-surface"
			} ${disabled ? "opacity-50" : ""}`}
			style={({ pressed }) =>
				pressed && !disabled && { transform: [{ scale: 0.98 }], opacity: 0.92 }
			}
		>
			<Text
				className={`text-body font-semibold ${
					variant === "primary" ? "text-onPrimary" : "text-textPrimary"
				}`}
			>
				{label}
			</Text>
		</Pressable>
	);
}