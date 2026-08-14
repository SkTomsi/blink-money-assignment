import { type ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/Button";
import type { Draft } from "./draft";

export type StepProps = {
	draft: Draft;
	update: (patch: Partial<Draft>) => void;
	onNext: () => void;
	canContinue: boolean;
};

export function Step({ children }: { children: ReactNode }) {
	return (
		<ScrollView
			className="flex-1"
			contentContainerClassName="gap-5 px-5 pb-8 pt-2"
			keyboardShouldPersistTaps="handled"
		>
			{children}
		</ScrollView>
	);
}

export function FooterButton({
	label,
	onPress,
	disabled,
}: {
	label: string;
	onPress: () => void;
	disabled?: boolean;
}) {
	return (
		<View className="pt-1">
			<Button label={label} onPress={onPress} disabled={disabled} />
		</View>
	);
}