import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";

const PRINCIPLES = [
	{
		icon: "wallet-outline",
		title: "Your money stays yours",
		body: "You invest separately — never a shared pile.",
	},
	{
		icon: "flame-outline",
		title: "Accountability, not pooling",
		body: "Show up, check in, and build the habit.",
	},
	{
		icon: "flag-outline",
		title: "Goals you reach together",
		body: "Shared goal, separate money.",
	},
];

export default function LearnMoreScreen() {
	const router = useRouter();

	return (
		<Screen>
			<ScreenHeader
				back
				title="How it works"
				subtitle="Wealth Circle in 60 seconds"
			/>
			<ScrollView
				contentContainerStyle={{ paddingBottom: 32 }}
				showsVerticalScrollIndicator={false}
			>
				<View className="px-5">
					<View className="gap-2 rounded-3xl bg-primary p-5">
						<Text className="text-h3 font-bold text-onPrimary">
							Your money is personal. Your habits {"don't"} have to be.
						</Text>
						<Text className="text-body text-onPrimary opacity-90">
							Every amount stays in your own account.
						</Text>
					</View>
				</View>

				<View className="mt-6 px-5">
					<Text className="mb-3 text-caption font-semibold uppercase tracking-wide text-textMuted">
						The idea
					</Text>
					<View className="gap-3">
						{PRINCIPLES.map((p) => (
							<View
								key={p.title}
								className="flex-row gap-3 rounded-2xl bg-surface p-4"
							>
								<View className="h-14 w-14 items-center aspect-square justify-center rounded-xl bg-primaryDim/20">
									<Ionicons name={p.icon as never} size={20} color="#7CCB4E" />
								</View>
								<View className="flex-1">
									<Text className="text-h4 text-textPrimary">{p.title}</Text>
									<Text className="mt-0.5 text-body text-textSecondary">
										{p.body}
									</Text>
								</View>
							</View>
						))}
					</View>
				</View>

				<View className="mt-6 px-5">
					<View className="gap-2 rounded-2xl border border-red/25 bg-red/10 p-4">
						<View className="flex-row items-center gap-2">
							<Ionicons name="alert-circle-outline" size={18} color="#D9483C" />
							<Text className="text-h4 text-redDeep">Not a shared corpus</Text>
						</View>
						<Text className="text-body text-textSecondary">
							No joint account, no pooled fund, no shared wallet.
						</Text>
					</View>
				</View>

				<View className="mt-6 px-5">
					<Button
						label="Create your first circle"
						onPress={() => router.push("/create-circle")}
					/>
				</View>
			</ScrollView>
		</Screen>
	);
}
