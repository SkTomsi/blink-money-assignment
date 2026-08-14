import { View } from "react-native";
import { OptionCard } from "@/components/ui/OptionCard";
import { TYPES } from "../constants";
import { FooterButton, Step, type StepProps } from "../StepShell";

export function TypeStep({ draft, update, onNext, canContinue }: StepProps) {
	return (
		<Step>
			<View className="gap-3">
				{TYPES.map((type) => (
					<OptionCard
						key={type.key}
						emoji={type.emoji}
						title={type.title}
						description={type.description}
						selected={draft.type === type.key}
					onPress={() => update({ type: type.key })}
					/>
				))}
			</View>
			<FooterButton
				label="Continue"
				disabled={!canContinue}
				onPress={onNext}
			/>
		</Step>
	);
}