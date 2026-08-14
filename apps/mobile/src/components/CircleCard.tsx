import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { CURRENT_USER } from "@/data/users";
import {
	useCircle,
	useMembers,
	useOverview,
	useUserMap,
} from "@/store/useCircleStore";

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

	const { progress, streak, atRisk } = overview;
	const selfDue = progress.dueUserIds.includes(CURRENT_USER.id);
	const othersDue = progress.dueUserIds.filter(
		(id) => id !== CURRENT_USER.id,
	).length;

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
					<View className="rounded-full bg-red/15 size-8 flex flex-col items-center justify-center">
						<Text className="text-micro font-semibold text-red">!</Text>
					</View>
				) : streak > 0 ? (
					<View className="rounded-full bg-primarySoft px-2.5 py-2">
						<Text className="text-micro font-semibold text-primary">
							🔥 {streak} {streakUnit(circle.frequency)}
							{streak !== 1 ? "s" : ""}
						</Text>
					</View>
				) : null}
			</View>

			<View className="flex-row items-center justify-between border-t border-border pt-3">
				<View className="flex-row">
					{members.slice(0, 5).map((m, i) => {
						const user = users[m.userId];
						if (!user) return null;
						return (
							<View key={m.id} style={{ marginLeft: i === 0 ? 0 : -8 }}>
								<Avatar color={user.avatarColor} name={user.name} size={24} />
							</View>
						);
					})}
					{members.length > 5 ? (
						<View
							className="h-6 w-6 items-center justify-center rounded-full bg-border"
							style={{ marginLeft: -8 }}
						>
							<Text className="text-micro font-bold text-textSecondary">
								+{members.length - 5}
							</Text>
						</View>
					) : null}
				</View>
				{othersDue > 0 ? (
					<Text className="text-caption font-medium text-textSecondary">
						{othersDue} to check in
					</Text>
				) : selfDue ? (
					<Text className="text-caption font-medium text-primaryDeep">
						{"You're due"}
					</Text>
				) : (
					<Text className="text-caption font-medium text-primaryDeep">
						All checked in ✓
					</Text>
				)}
			</View>
		</Pressable>
	);
}
