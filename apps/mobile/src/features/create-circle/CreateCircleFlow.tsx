import {
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { Screen } from "@/components/ui/Screen";
import { StepperHeader } from "@/components/ui/StepperHeader";
import { FORM_STEPS, STEP_META, SUCCESS_STEP } from "./constants";
import { InvestmentStep } from "./steps/InvestmentStep";
import { MembersStep } from "./steps/MembersStep";
import { NameStep } from "./steps/NameStep";
import { SuccessStep } from "./steps/SuccessStep";
import { TypeStep } from "./steps/TypeStep";
import { useCreateCircleFlow } from "./useCreateCircleFlow";

export function CreateCircleFlow() {
	const flow = useCreateCircleFlow();
	const { step, draft, update, ui, created, entrance, targetDate } = flow;

	if (step === SUCCESS_STEP && created) {
		return (
			<Screen>
				<SuccessStep
					circle={created}
					memberCount={draft.memberIds.length}
					entrance={entrance}
					onCopyLink={flow.actions.onCopyLink}
					copied={ui.copied}
				/>
			</Screen>
		);
	}

	const meta = STEP_META[step] ?? STEP_META[0];
	const stepProps = {
		draft,
		update,
		onNext: flow.actions.goNext,
		canContinue: flow.canContinue,
	};

	return (
		<Screen>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				className="flex-1"
			>
				<StepperHeader
					title={meta.title}
					subtitle={meta.subtitle}
					step={step}
					total={FORM_STEPS}
					canGoBack={step < FORM_STEPS - 1}
					onBack={flow.actions.goBack}
				/>
				{step === 0 && <TypeStep {...stepProps} />}
				{step === 1 && <NameStep {...stepProps} />}
				{step === 2 && (
					<InvestmentStep
						{...stepProps}
						periods={flow.periods}
						total={flow.total}
						targetDate={targetDate}
					/>
				)}
				{step === 3 && (
					<MembersStep
						query={draft.query}
						results={flow.searchResults}
						invitedUsers={flow.invitedUsers}
						invitingId={ui.invitingId}
						creating={ui.creating}
						error={ui.error}
						inviteLink={flow.inviteLink}
						copied={ui.copied}
						onQueryChange={(query) => update({ query })}
						onInvite={flow.actions.onQueueInvite}
						onRemove={flow.actions.onRemoveInvite}
						onCopyLink={flow.actions.onCopyLink}
						onFinish={flow.actions.onFinish}
					/>
				)}
			</KeyboardAvoidingView>
		</Screen>
	);
}