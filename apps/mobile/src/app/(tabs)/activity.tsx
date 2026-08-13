import { FlatList, Pressable, Text, View } from "react-native";
import { EmptyState } from "@/components/ui/EmptyState";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { timeAgo } from "@/lib/dates";
import { useCircleStore, useNotifications, useUnreadCount } from "@/store/useCircleStore";

export default function ActivityScreen() {
	const notifications = useNotifications();
	const unread = useUnreadCount();
	const markRead = useCircleStore((s) => s.markNotificationRead);
	const markAllRead = useCircleStore((s) => s.markAllNotificationsRead);

	const header = (
		<ScreenHeader
			title="Activity"
			subtitle="Miss nothing in your circles"
			right={
				unread > 0 ? (
					<Pressable onPress={() => markAllRead()} hitSlop={12}>
						<Text className="text-caption font-semibold text-primary">
							Mark all read
						</Text>
					</Pressable>
				) : null
			}
		/>
	);

	if (notifications.length === 0) {
		return (
			<Screen>
				{header}
				<EmptyState
					icon="🔔"
					title="You're all caught up"
					body="Milestones, nudges and check-ins from your circles will show up here."
				/>
			</Screen>
		);
	}

	return (
		<Screen>
			<FlatList
				data={notifications}
				keyExtractor={(n) => n.id}
				ListHeaderComponent={header}
				renderItem={({ item }) => (
					<Pressable
						onPress={() => !item.read && markRead(item.id)}
						className={`flex-row items-center gap-3 px-5 py-3 ${
							item.read ? "opacity-70" : ""
						}`}
						style={({ pressed }) =>
							pressed && { transform: [{ scale: 0.99 }], opacity: 0.9 }
						}
					>
						<View className="h-10 w-10 items-center justify-center rounded-xl bg-surfaceAlt">
							<Text className="text-lg">{item.icon}</Text>
						</View>
						<View className="flex-1">
							<View className="flex-row items-center gap-2">
								<Text className="flex-1 text-body font-semibold text-textPrimary">
									{item.title}
								</Text>
								{!item.read ? (
									<View className="h-2 w-2 rounded-full bg-primary" />
								) : null}
							</View>
							{item.body ? (
								<Text className="mt-0.5 text-caption text-textSecondary">
									{item.body}
								</Text>
							) : null}
						</View>
						<Text className="text-micro text-textMuted">
							{timeAgo(item.createdAt)}
						</Text>
					</Pressable>
				)}
				ItemSeparatorComponent={() => (
					<View className="mx-5 h-px bg-border" />
				)}
				contentContainerStyle={{ paddingBottom: 24 }}
			/>
		</Screen>
	);
}