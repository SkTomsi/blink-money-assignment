import { useEffect, useState } from "react";
import { Text, type TextProps } from "react-native";
import {
	Easing,
	runOnJS,
	useAnimatedReaction,
	useReducedMotion,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

export function CountUp({
	value,
	format,
	duration = 900,
	...rest
}: {
	value: number;
	format: (n: number) => string;
	duration?: number;
} & TextProps) {
	const reduced = useReducedMotion();
	const progress = useSharedValue(reduced ? 1 : 0);
	const [display, setDisplay] = useState(value);

	useEffect(() => {
		if (reduced) {
			setDisplay(value);
			progress.value = 1;
			return;
		}
		progress.value = 0;
		progress.value = withTiming(1, {
			duration,
			easing: Easing.out(Easing.cubic),
		});
	}, [value, duration, progress, reduced]);

	useAnimatedReaction(
		() => progress.value,
		(p) => {
			runOnJS(setDisplay)(Math.round(p * value));
		},
		[progress, value],
	);

	return <Text {...rest}>{format(display)}</Text>;
}
