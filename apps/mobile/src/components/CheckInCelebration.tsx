import { useEffect, useState } from "react";
import { Modal, Text, View } from "react-native";
import Animated, {
	Easing,
	runOnJS,
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withTiming,
} from "react-native-reanimated";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatINR } from "@/lib/format";

export function CheckInCelebration({
	visible,
	amount,
	fromTotal,
	toTotal,
	targetAmount,
	saved,
	onClose,
}: {
	visible: boolean;
	amount: number;
	fromTotal: number;
	toTotal: number;
	targetAmount: number;
	saved: boolean;
	onClose: () => void;
}) {
	const [displayTotal, setDisplayTotal] = useState(fromTotal);
	const [displayPct, setDisplayPct] = useState(
		targetAmount > 0 ? Math.min(1, fromTotal / targetAmount) : 0,
	);

	const backdrop = useSharedValue(0);
	const card = useSharedValue(0);
	const badge = useSharedValue(0);
	const chip = useSharedValue(0);
	const progress = useSharedValue(0);

	useAnimatedReaction(
		() => progress.value,
		(value) => {
			if (value > 0) {
				const current = Math.round(fromTotal + (toTotal - fromTotal) * value);
				runOnJS(setDisplayTotal)(current);
				if (targetAmount > 0) {
					runOnJS(setDisplayPct)(Math.min(1, current / targetAmount));
				}
			}
		},
		[progress, fromTotal, toTotal, targetAmount],
	);

	useEffect(() => {
		if (!visible) return;
		setDisplayTotal(fromTotal);
		backdrop.value = 0;
		card.value = 0;
		badge.value = 0;
		chip.value = 0;
		progress.value = 0;

		backdrop.value = withTiming(1, { duration: 250 });
		card.value = withTiming(1, {
			duration: 400,
			easing: Easing.out(Easing.quad),
		});
		badge.value = withTiming(1, { duration: 400 });
		chip.value = withDelay(600, withTiming(1, { duration: 300 }));
		progress.value = withTiming(1, {
			duration: 1500,
			easing: Easing.out(Easing.cubic),
		});
	}, [visible, backdrop, card, badge, chip, progress, fromTotal]);

	const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));
	const cardStyle = useAnimatedStyle(() => ({
		opacity: card.value,
		transform: [{ translateY: (1 - card.value) * 24 }],
	}));
	const badgeStyle = useAnimatedStyle(() => ({
		opacity: badge.value,
		transform: [{ scale: 0.8 + badge.value * 0.2 }],
	}));
	const chipStyle = useAnimatedStyle(() => ({
		opacity: chip.value,
		transform: [{ scale: chip.value }],
	}));

	return (
		<Modal
			visible={visible}
			transparent
			animationType="none"
			onRequestClose={onClose}
		>
			<View className="flex-1">
				<Animated.View
					className="absolute inset-0 overflow-hidden bg-black/70"
					style={backdropStyle}
				/>
				<Animated.View
					className="flex-1 items-center justify-center px-6"
					style={cardStyle}
				>
					<View className="w-full items-center gap-5 rounded-3xl bg-surface p-7">
						<Animated.View
							className="h-20 w-20 items-center justify-center rounded-full bg-primarySoft"
							style={badgeStyle}
						>
							<Text className="text-4xl">💰</Text>
						</Animated.View>
						<View className="items-center gap-1">
							<Text className="text-caption font-semibold uppercase tracking-wider text-textMuted">
								You invested
							</Text>
							<Text className="text-h2 font-bold tabular-nums text-textPrimary">
								{formatINR(amount)}
							</Text>
							<Text className="text-caption text-textSecondary">
								{saved
									? "🔥 Streak saved — everyone's in!"
									: "Every rupee compounds. Keep showing up."}
							</Text>
						</View>
						<View className="w-full gap-1.5 rounded-2xl bg-surfaceAlt p-4">
							<View className="flex-row items-center justify-between">
								<Text className="text-caption font-semibold uppercase tracking-wide text-textMuted">
									Circle corpus
								</Text>
								<Animated.View
									className="rounded-full bg-primarySoft px-2 py-0.5"
									style={chipStyle}
								>
									<Text className="text-micro font-semibold text-primaryDeep">
										+{formatINR(amount)}
									</Text>
								</Animated.View>
							</View>
							<Text className="text-h3 font-bold tabular-nums text-textPrimary">
								{formatINR(displayTotal)}
							</Text>
							<ProgressBar progress={displayPct} />
							<Text className="text-caption text-textMuted">
								{Math.round(displayPct * 100)}% of {formatINR(targetAmount)}{" "}
								target
							</Text>
						</View>
						<Button label="Done" onPress={onClose} />
					</View>
				</Animated.View>
			</View>
		</Modal>
	);
}
