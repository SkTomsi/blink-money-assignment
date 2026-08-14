import { useRouter } from "expo-router";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/format";
import type { Circle } from "@/types";
import { monthYearLabel, periodLabel } from "../constants";

export function SuccessStep({
	circle,
	memberCount,
	entrance,
	onCopyLink,
	copied,
}: {
	circle: Circle;
	memberCount: number;
	entrance: Animated.Value;
	onCopyLink: () => void;
	copied: boolean;
}) {
	const router = useRouter();

	return (
		<ScrollView
			className="flex-1"
			contentContainerClassName="flex-1 justify-center gap-6 px-5 pb-8 pt-2"
		>
			<Animated.View style={{ opacity: entrance }} className="gap-6">
				<View className="items-center gap-3">
					<View className="h-20 w-20 items-center justify-center rounded-3xl bg-primarySoft">
						<Text className="text-4xl">🎉</Text>
					</View>
					<Text className="text-center text-h3 text-textPrimary">
						{circle.name} is ready
					</Text>
					<Text className="text-center text-body text-textSecondary">
						Your circle is live. Invited members will see it when they accept.
					</Text>
				</View>

				<View className="gap-3 rounded-2xl bg-surface p-4">
					<SummaryRow
						label="Investment"
						value={`${formatINR(circle.contributionAmount)} ${periodLabel(circle.frequency)} each`}
					/>
					<SummaryRow
						label="Total"
						value={`≈ ${formatINR(circle.targetAmount)} by ${monthYearLabel(circle.targetDate)}`}
					/>
					<SummaryRow
						label="Members"
						value={
							memberCount > 0
								? `You + ${memberCount} invited`
								: "You"
						}
					/>
				</View>

				<Pressable
					onPress={onCopyLink}
					className="flex-row items-center justify-center gap-2 rounded-xl border border-border bg-surface py-3"
					style={({ pressed }) => pressed && { transform: [{ scale: 0.98 }] }}
				>
					<Text className="text-body font-semibold text-textPrimary">
						{copied ? "Invite link copied ✓" : "Copy invite link"}
					</Text>
				</Pressable>

				<Button
					label="Start investing"
					onPress={() => router.replace("/")}
				/>
			</Animated.View>
		</ScrollView>
	);
}

function SummaryRow({ label, value }: { label: string; value: string }) {
	return (
		<View className="flex-row items-center justify-between">
			<Text className="text-caption text-textMuted">{label}</Text>
			<Text className="text-body font-semibold text-textPrimary">{value}</Text>
		</View>
	);
}
