import { useEffect, useRef } from "react";
import * as SplashScreen from "expo-splash-screen";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useCircleStore } from "@/store/useCircleStore";

SplashScreen.preventAutoHideAsync().catch(() => {});

export function HydrationGate({ children }: { children: React.ReactNode }) {
	const hydrated = useCircleStore((s) => s.hydrated);
	const hidden = useRef(false);

	useEffect(() => {
		if (hydrated && !hidden.current) {
			hidden.current = true;
			SplashScreen.hideAsync().catch(() => {});
		}
	}, [hydrated]);

	if (!hydrated) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return <>{children}</>;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});