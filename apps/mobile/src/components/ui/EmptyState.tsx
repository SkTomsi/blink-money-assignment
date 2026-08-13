import { Text, View } from "react-native";
import { Button } from "@/components/ui/Button";

export function EmptyState({
	icon,
	title,
	body,
	actionLabel,
	onAction,
}: {
	icon: string;
	title: string;
	body: string;
	actionLabel?: string;
	onAction?: () => void;
}) {
	return (
		<View className="flex-1 items-center justify-center gap-3 px-8">
			<View className="h-16 w-16 items-center justify-center rounded-3xl bg-surfaceAlt">
				<Text className="text-3xl">{icon}</Text>
			</View>
			<Text className="mt-1 text-center text-h3 text-textPrimary">{title}</Text>
			<Text className="text-center text-body text-textSecondary">{body}</Text>
			{actionLabel && onAction ? (
				<View className="mt-3 w-full">
					<Button label={actionLabel} onPress={onAction} />
				</View>
			) : null}
		</View>
	);
}