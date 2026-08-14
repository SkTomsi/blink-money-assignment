import { Text, View } from "react-native";
import { Chip } from "@/components/ui/Chip";
import { TextField } from "@/components/ui/TextField";
import { NAME_SUGGESTIONS } from "../constants";
import { FooterButton, Step, type StepProps } from "../StepShell";

export function NameStep({ draft, update, onNext, canContinue }: StepProps) {
	return (
		<Step>
			<View className="gap-3">
				<TextField
					label="Circle name"
					value={draft.name}
					onChangeText={(name) => update({ name })}
					placeholder={draft.type === "friends" ? "The Boys" : "My Wealth Circle"}
					maxLength={40}
					autoFocus
				/>
				{draft.type ? (
					<View className="gap-2">
						<Text className="text-caption font-semibold uppercase tracking-wide text-textMuted">
							Ideas
						</Text>
						<View className="flex-row flex-wrap gap-2">
							{NAME_SUGGESTIONS[draft.type].map((suggestion) => (
								<Chip
									key={suggestion}
									label={suggestion}
									selected={draft.name === suggestion}
									onPress={() => update({ name: suggestion })}
								/>
							))}
						</View>
					</View>
				) : null}
			</View>
			<FooterButton
				label="Continue"
				disabled={!canContinue}
				onPress={onNext}
			/>
		</Step>
	);
}