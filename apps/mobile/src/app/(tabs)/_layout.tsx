import { colors, colorsLight } from "@blink/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";

export default function TabsLayout() {
	const { isDark } = useTheme();
	const pal = isDark ? colors : colorsLight;

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: pal.primary,
				tabBarInactiveTintColor: pal.textMuted,
				tabBarStyle: {
					backgroundColor: pal.surface,
					borderTopColor: pal.border,
				},
				tabBarLabelStyle: {
					fontSize: 11,
					fontWeight: "600",
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons
							name={focused ? "home" : "home-outline"}
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="activity"
				options={{
					title: "Activity",
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons
							name={focused ? "notifications" : "notifications-outline"}
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons
							name={focused ? "person" : "person-outline"}
							size={size}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
