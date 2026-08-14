import { colors, colorsLight } from "@blink/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, RefreshControl, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { CircleCard } from "@/components/CircleCard";
import { CountUp } from "@/components/ui/CountUp";
import { EmptyState } from "@/components/ui/EmptyState";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { formatINR } from "@/lib/format";
import { delay } from "@/lib/mockRequest";
import {
	useCircles,
	useDashboardStats,
	useUnreadCount,
} from "@/store/useCircleStore";
import { useTheme } from "@/theme/ThemeProvider";

export default function HomeScreen() {
	const circles = useCircles();
	const stats = useDashboardStats();
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
	const onPrimary = isDark ? colors.onPrimary : colorsLight.onPrimary;

	const header = (
		<ScreenHeader
			title="Wealth Circle"
			subtitle="By BlinkMoney"
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
	);

	const floatingCreate = (
		<View className="absolute right-5 z-10" style={{ bottom: 24 }}>
			<Animated.View entering={FadeInUp.duration(420)}>
				<Pressable
					onPress={() => router.push("/create-circle")}
					hitSlop={12}
					className="h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
					style={({ pressed }) =>
						pressed && { transform: [{ scale: 0.9 }], opacity: 0.92 }
					}
				>
					<Ionicons name="add" size={28} color={onPrimary} />
				</Pressable>
			</Animated.View>
		</View>
	);

	const dashboard = (
		<View className="px-5 pb-1 pt-8">
			<Animated.View entering={FadeInUp.duration(460)}>
				<View className="rounded-3xl bg-primary p-5">
					<View className="flex-row items-center justify-between">
						<Text className="text-caption font-semibold uppercase tracking-wide text-onPrimary opacity-80">
							Wealth dashboard
						</Text>
						<Pressable
							onPress={() => router.push("/learn-more")}
							hitSlop={12}
							className="h-7 w-7 items-center justify-center rounded-full bg-onPrimary/15"
							style={({ pressed }) =>
								pressed && { transform: [{ scale: 0.92 }], opacity: 0.8 }
							}
						>
							<Ionicons
								name="information-outline"
								size={16}
								color={onPrimary}
							/>
						</Pressable>
					</View>
					<View className="mt-4 flex-row items-center">
						<View className="flex-1">
							<Text className="text-caption font-medium text-onPrimary opacity-80">
								Total invested
							</Text>
							<CountUp
								value={stats.totalInvested}
								format={formatINR}
								duration={900}
								className="mt-1 text-h2 font-bold tabular-nums text-onPrimary"
							/>
						</View>
						<View className="mx-5 h-10 w-px bg-onPrimary/20" />
						<View className="flex-1 items-end">
							<Text className="text-caption font-medium text-onPrimary opacity-80">
								Investments
							</Text>
							<CountUp
								value={stats.totalInvestments}
								format={(n) => String(n)}
								duration={900}
								className="mt-1 text-h2 font-bold tabular-nums text-onPrimary"
							/>
						</View>
					</View>
				</View>
			</Animated.View>
			<Text className="mt-6 mb-3 text-caption font-semibold uppercase tracking-wide text-textMuted">
				Your circles
			</Text>
		</View>
	);

	if (circles.length === 0) {
		return (
			<Screen>
				<View className="flex-1">
					{header}
					<EmptyState
						icon="🌱"
						title="Your wealth grows better together"
						body="Create your first circle and start building a shared investing habit."
					/>
					{floatingCreate}
				</View>
			</Screen>
		);
	}

	return (
		<Screen>
			<View className="flex-1">
				{header}
				<Animated.FlatList
					entering={FadeInUp.duration(460)}
					data={circles}
					keyExtractor={(c) => c.id}
					renderItem={({ item }) => (
						<View className="px-5">
							<CircleCard circleId={item.id} />
						</View>
					)}
					ListHeaderComponent={dashboard}
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
				{floatingCreate}
			</View>
		</Screen>
	);
}
