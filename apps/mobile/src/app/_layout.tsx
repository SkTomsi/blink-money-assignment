import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HydrationGate } from "@/components/HydrationGate";
import { useCircleStore } from "@/store/useCircleStore";
import { ThemeProvider } from "@/theme/ThemeProvider";
import "../global.css";

export default function RootLayout() {
	const hydrate = useCircleStore((s) => s.hydrate);

	useEffect(() => {
		hydrate();
	}, [hydrate]);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ThemeProvider>
				<HydrationGate>
					<Stack screenOptions={{ headerShown: false }} />
				</HydrationGate>
			</ThemeProvider>
		</GestureHandlerRootView>
	);
}
