import { colors, colorsLight } from "@blink/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { CircleCard } from "@/components/CircleCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { delay } from "@/lib/mockRequest";
import { useCircles, useUnreadCount } from "@/store/useCircleStore";
import { useTheme } from "@/theme/ThemeProvider";

export default function HomeScreen() {
	const circles = useCircles();
	const unread = useUnreadCount();
	const router = useRouter();
	const { isDark } = useTheme();
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = async () => {
		setRefreshing(true);
		await delay(700);
		setRefreshing(false);
	};

	const tint = isDark ? colors.primary : colorsLight.primary;
	const muted = isDark ? colors.textMuted : colorsLight.textMuted;

	const header = (
		<View className="gap-4">
			<ScreenHeader
				title="Wealth Circle"
				subtitle="Build wealth together."
				right={
					<Pressable
						onPress={() => router.navigate("/(tabs)/activity")}
						hitSlop={12}
						className="h-10 w-10 items-center justify-center rounded-xl bg-surface"
						style={({ pressed }) =>
							pressed && { transform: [{ scale: 0.94 }], opacity: 0.8 }
						}
					>
						<Ionicons name="notifications-outline" size={20} color={muted} />
						{unread > 0 ? (
							<View className="absolute -right-0.5 -top-0.5 h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1">
								<Text className="text-[10px] font-bold text-onPrimary">
									{unread > 9 ? "9+" : unread}
								</Text>
							</View>
						) : null}
					</Pressable>
				}
			/>
			<View className="px-5 mb-5">
				<Pressable
					onPress={() => router.push("/create-circle")}
					className="flex-row items-center justify-center gap-2 rounded-xl bg-primary py-3.5"
					style={({ pressed }) =>
						pressed && { transform: [{ scale: 0.98 }], opacity: 0.92 }
					}
				>
					<Ionicons
						name="add"
						size={18}
						color={isDark ? colors.onPrimary : colorsLight.onPrimary}
					/>
					<Text className="text-body font-semibold text-onPrimary">
						Create a circle
					</Text>
				</Pressable>
			</View>
		</View>
	);

	if (circles.length === 0) {
		return (
			<Screen>
				{header}
				<EmptyState
					icon="🌱"
					title="Your wealth grows better together"
					body="Create your first circle and start building a shared investing habit."
					actionLabel="Create your first circle"
					onAction={() => router.push("/create-circle")}
				/>
			</Screen>
		);
	}

	return (
		<Screen>
			<FlatList
				data={circles}
				keyExtractor={(c) => c.id}
				renderItem={({ item }) => (
					<View className="px-5">
						<CircleCard circleId={item.id} />
					</View>
				)}
				ListHeaderComponent={header}
				ItemSeparatorComponent={() => <View className="h-3" />}
				contentContainerStyle={{ paddingBottom: 24 }}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={tint}
					/>
				}
			/>
		</Screen>
	);
}
