import { Text, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";

export default function CreateCircleScreen() {
	return (
		<Screen>
			<ScreenHeader title="Create a circle" back />
			<View className="flex-1 items-center justify-center px-8">
				<View className="gap-3">
					<View className="h-16 w-16 items-center justify-center rounded-3xl bg-surfaceAlt mx-auto">
						<Text className="text-3xl">🌱</Text>
					</View>
					<Text className="mt-1 text-center text-h3 text-textPrimary">
						Coming in the next phase
					</Text>
					<Text className="text-center text-body text-textSecondary">
						Circle type, name, goal, contributions and invites land here next.
					</Text>
				</View>
			</View>
		</Screen>
	);
}
