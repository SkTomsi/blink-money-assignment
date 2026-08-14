import { Text, View } from "react-native";
import { Chip } from "@/components/ui/Chip";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { TextField } from "@/components/ui/TextField";
import { formatINR } from "@/lib/format";
import { DURATIONS, monthYearLabel, periodUnit } from "../constants";
import { parseAmount } from "../draft";
import { FooterButton, Step, type StepProps } from "../StepShell";

export function InvestmentStep({
	draft,
	update,
	onNext,
	canContinue,
	periods,
	total,
	targetDate,
}: StepProps & {
	periods: number;
	total: number;
	targetDate: string;
}) {
	const contribution = parseAmount(draft.contribution);
	const unit = periodUnit(draft.frequency);
	const unitLabel = periods > 1 ? `${unit}s` : unit;

	return (
		<Step>
			<View className="gap-5">
				<TextField
					label={`Amount to invest ${draft.frequency === "daily" ? "per day" : "per month"}`}
					value={draft.contribution}
					onChangeText={(contribution) => update({ contribution })}
					placeholder="1,000"
					keyboardType="number-pad"
					hint="The same amount everyone in the circle invests"
				/>

				<View className="gap-2">
					<Text className="text-caption font-semibold uppercase tracking-wide text-textMuted">
						Frequency
					</Text>
					<SegmentedControl
						options={[
							{ key: "daily", label: "Daily", caption: "Build a habit" },
							{ key: "monthly", label: "Monthly", caption: "Steady growth" },
						]}
						value={draft.frequency}
						onChange={(frequency) => update({ frequency })}
					/>
				</View>

				<View className="gap-2">
					<Text className="text-caption font-semibold uppercase tracking-wide text-textMuted">
						Duration
					</Text>
					<View className="flex-row flex-wrap gap-2">
						{DURATIONS.map((duration) => (
							<Chip
								key={duration.months}
								label={duration.label}
								selected={draft.durationMonths === duration.months}
								onPress={() => update({ durationMonths: duration.months })}
							/>
						))}
					</View>
				</View>

				<View className="gap-1 rounded-2xl border border-border bg-surface p-4">
					<Text className="text-caption font-semibold uppercase tracking-wide text-textMuted">
						Your total
					</Text>
					<Text className="mt-1 text-body text-textPrimary">
						{contribution > 0
							? `${formatINR(contribution)}/${unit} × ${periods} ${unitLabel}`
							: "Set your amount to see your total"}
					</Text>
					<Text className="mt-2 text-h4 font-bold text-primaryDeep">
						{total > 0 ? formatINR(total) : "—"}
					</Text>
					<Text className="mt-1 text-caption text-textMuted">
						Everyone in the circle invests the same, by{" "}
						{monthYearLabel(targetDate)} · via BlinkMoney SIPs
					</Text>
				</View>
			</View>
			<FooterButton
				label="Continue"
				disabled={!canContinue}
				onPress={onNext}
			/>
		</Step>
	);
}
