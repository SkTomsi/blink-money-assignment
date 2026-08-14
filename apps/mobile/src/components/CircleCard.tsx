import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatINR } from "@/lib/format";
import { useCircle, useMembers, useOverview, useUserMap } from "@/store/useCircleStore";

const TYPE_LABELS: Record<string, string> = {
	family: "Family",
	couple: "Couple",
	friends: "Friends",
};

const TYPE_EMOJIS: Record<string, string> = {
	family: "🏡",
	couple: "💛",
	friends: "🤝",
};

const FREQ_LABELS: Record<string, string> = {
	daily: "Daily",
	monthly: "Monthly",
};

const streakUnit = (frequency: "daily" | "monthly") =>
	frequency === "daily" ? "day" : "month";

export function CircleCard({ circleId }: { circleId: string }) {
	const circle = useCircle(circleId);
	const overview = useOverview(circleId);
	const members = useMembers(circleId);
	const users = useUserMap();
	const router = useRouter();

	if (!circle || !overview) return null;

	const { total, progress, goal, streak, atRisk } = overview;
	const goalPct = Math.round(goal.pct * 100);
	const periodPct = Math.round(progress.pct * 100);
	const dueNames = progress.dueUserIds
		.map((id) => users[id]?.name ?? "Someone")
		.join(", ");

	return (
		<Pressable
			onPress={() => router.push(`/circle/${circle.id}`)}
			className="gap-3 rounded-2xl bg-surface p-4"
			style={({ pressed }) =>
				pressed && { transform: [{ scale: 0.985 }], opacity: 0.92 }
			}
		>
			<View className="flex-row items-center gap-3">
				<View className="h-11 w-11 items-center justify-center rounded-xl bg-primarySoft">
					<Text className="text-xl">{TYPE_EMOJIS[circle.type] ?? "💰"}</Text>
				</View>
				<View className="flex-1">
					<Text className="text-h4 text-textPrimary">{circle.name}</Text>
					<Text className="mt-0.5 text-caption text-textMuted">
						{TYPE_LABELS[circle.type] ?? circle.type} ·{" "}
						{FREQ_LABELS[circle.frequency] ?? circle.frequency} ·{" "}
						{members.length} {members.length === 1 ? "member" : "members"}
					</Text>
				</View>
				{atRisk ? (
					<View className="rounded-full bg-red/15 px-2.5 py-1">
						<Text className="text-micro font-semibold text-red">At risk</Text>
					</View>
				) : streak > 0 ? (
					<View className="rounded-full bg-primarySoft px-2.5 py-1">
						<Text className="text-micro font-semibold text-primaryDeep">
							🔥 {streak} {streakUnit(circle.frequency)}
							{streak !== 1 ? "s" : ""}
						</Text>
					</View>
				) : null}
			</View>

			<View className="flex-row items-baseline justify-between">
				<Text className="text-h4 font-bold tabular-nums text-textPrimary">
					{formatINR(total)}{" "}
					<Text className="text-caption font-medium text-textMuted">
						/ {formatINR(circle.targetAmount)}
					</Text>
				</Text>
				<Text className="text-caption font-semibold text-textMuted">
					{goalPct}%
				</Text>
			</View>
			<ProgressBar progress={goal.pct} />

			<View className="flex-row items-center justify-between border-t border-border pt-3">
				<Text className="text-caption text-textSecondary">
					{FREQ_LABELS[circle.frequency]} · {formatINR(progress.invested)} /{" "}
					{formatINR(progress.target)} ({periodPct}%)
				</Text>
				{progress.completedUserIds.length > 0 ? (
					<View className="flex-row">
						{progress.completedUserIds.slice(0, 3).map((id, i) => {
							const user = users[id];
							if (!user) return null;
							return (
								<View key={id} style={{ marginLeft: i === 0 ? 0 : -8 }}>
									<Avatar color={user.avatarColor} name={user.name} size={22} />
								</View>
							);
						})}
					</View>
				) : (
					<Text className="text-caption text-textMuted">No check-ins yet</Text>
				)}
			</View>

			{atRisk && dueNames ? (
				<View className="gap-0.5 rounded-xl bg-red/10 px-3 py-2">
					<Text className="text-caption font-semibold text-red">
						⚠️ Streak at risk
					</Text>
					<Text className="text-caption text-textSecondary">
						{dueNames} has not checked in yet
					</Text>
				</View>
			) : null}
		</Pressable>
	);
}