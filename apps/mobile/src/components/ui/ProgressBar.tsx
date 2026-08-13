import { View } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useReducedMotion,
	withTiming,
} from "react-native-reanimated";

export function ProgressBar({
	progress,
	height = 8,
	colorClass = "bg-primary",
	trackClass = "bg-surfaceAlt",
}: {
	progress: number;
	height?: number;
	colorClass?: string;
	trackClass?: string;
}) {
	const reduced = useReducedMotion();
	const clamped = Math.min(1, Math.max(0, progress));

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{
				scaleX: reduced
					? clamped
					: withTiming(clamped, {
							duration: 600,
							easing: Easing.out(Easing.cubic),
						}),
			},
		],
	}));

	return (
		<View
			className={`w-full overflow-hidden rounded-full ${trackClass}`}
			style={{ height }}
		>
			<Animated.View
				className={`h-full w-full rounded-full ${colorClass}`}
				style={[animatedStyle, { transformOrigin: "left" }]}
			/>
		</View>
	);
}