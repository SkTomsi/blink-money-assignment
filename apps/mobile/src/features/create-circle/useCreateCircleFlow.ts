import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Animated } from "react-native";
import { CURRENT_USER } from "@/data/users";
import { copyText } from "@/lib/clipboard";
import { addMonths, durationInPeriods } from "@/lib/dates";
import { sipProjection } from "@/lib/returns";
import { useCircleStore, useUsers } from "@/store/useCircleStore";
import type { Circle, User } from "@/types";
import {
	canContinue,
	FORM_STEPS,
	SUCCESS_STEP,
	slugOf,
} from "./constants";
import { createDraft, type Draft, parseAmount } from "./draft";

type FlowUI = {
	creating: boolean;
	error: string | null;
	copied: boolean;
	invitingId: string | null;
};

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useCreateCircleFlow() {
	const router = useRouter();
	const createCircle = useCircleStore((s) => s.createCircle);
	const inviteMember = useCircleStore((s) => s.inviteMember);
	const users = useUsers();

	const [step, setStep] = useState(0);
	const [draft, setDraft] = useState<Draft>(createDraft());
	const [ui, setUi] = useState<FlowUI>({
		creating: false,
		error: null,
		copied: false,
		invitingId: null,
	});
	const [created, setCreated] = useState<Circle | null>(null);
	const entrance = useRef(new Animated.Value(0)).current;

	const update = useCallback((patch: Partial<Draft>) => {
		setDraft((d) => ({ ...d, ...patch }));
	}, []);

	const targetDate = useMemo(
		() => addMonths(new Date(), draft.durationMonths).toISOString(),
		[draft.durationMonths],
	);

	const periods = useMemo(
		() =>
			durationInPeriods(draft.frequency, draft.durationMonths, targetDate),
		[draft.frequency, draft.durationMonths, targetDate],
	);

	/** Total invested over the duration = amount × periods. */
	const total = useMemo(
		() => parseAmount(draft.contribution) * periods,
		[draft.contribution, periods],
	);

	/** What the SIP could grow to at ~15% p.a. over the duration. */
	const projection = useMemo(
		() =>
			sipProjection(
				parseAmount(draft.contribution),
				periods,
				draft.frequency === "monthly" ? 12 : 365,
			),
		[draft.contribution, draft.frequency, periods],
	);

	const inviteLink = `blinkmoney.in/join/${slugOf(draft.name || "my-circle")}`;

	const searchResults = useMemo(() => {
		const query = draft.query.trim().toLowerCase();
		if (!query) return [];
		return users.filter(
			(u) =>
				u.id !== CURRENT_USER.id &&
				!draft.memberIds.includes(u.id) &&
				(u.name.toLowerCase().includes(query) ||
					u.username.toLowerCase().includes(query)),
		);
	}, [draft.query, draft.memberIds, users]);

	const invitedUsers = useMemo(
		() =>
			draft.memberIds
				.map((id) => users.find((u) => u.id === id))
				.filter((u): u is User => Boolean(u)),
		[draft.memberIds, users],
	);

	const goNext = useCallback(
		() => setStep((s) => Math.min(s + 1, FORM_STEPS - 1)),
		[],
	);

	const goBack = useCallback(() => {
		setStep((s) => {
			if (s > 0) {
				setUi((u) => ({ ...u, error: null }));
				return s - 1;
			}
			router.back();
			return s;
		});
	}, [router]);

	const onCopyLink = useCallback(async () => {
		const ok = await copyText(`https://${inviteLink}`);
		if (ok) {
			setUi((u) => ({ ...u, copied: true }));
			setTimeout(() => setUi((u) => ({ ...u, copied: false })), 2000);
		}
	}, [inviteLink]);

	const onQueueInvite = useCallback(
		async (user: User) => {
			setUi((u) => ({ ...u, invitingId: user.id }));
			await delay(350);
			update({
				memberIds: [...draft.memberIds, user.id],
				query: "",
			});
			setUi((u) => ({ ...u, invitingId: null }));
		},
		[draft.memberIds, update],
	);

	const onRemoveInvite = useCallback(
		(userId: string) =>
			update({ memberIds: draft.memberIds.filter((id) => id !== userId) }),
		[draft.memberIds, update],
	);

	const onFinish = useCallback(async () => {
		if (!draft.type || ui.creating) return;
		setUi((u) => ({ ...u, creating: true, error: null }));
		try {
			const circle = await createCircle({
				name: draft.name.trim(),
				type: draft.type,
				frequency: draft.frequency,
				contributionAmount: parseAmount(draft.contribution),
				durationMonths: draft.durationMonths,
				inviteSlug: slugOf(draft.name),
			});
			if (draft.memberIds.length > 0) {
				await Promise.all(
					draft.memberIds.map((id) => inviteMember(circle.id, id)),
				);
			}
			setCreated(circle);
			setStep(SUCCESS_STEP);
			entrance.setValue(0);
			Animated.spring(entrance, {
				toValue: 1,
				useNativeDriver: true,
			}).start();
		} catch (err) {
			setUi((u) => ({
				...u,
				error:
					err instanceof Error ? err.message : "Couldn't create your circle",
			}));
		} finally {
			setUi((u) => ({ ...u, creating: false }));
		}
	}, [
		draft,
		createCircle,
		inviteMember,
		entrance,
		ui.creating,
	]);

	return {
		step,
		draft,
		update,
		ui,
		created,
		entrance,
		targetDate,
		periods,
		total,
		projection,
		inviteLink,
		searchResults,
		invitedUsers,
		canContinue: canContinue(draft, step),
		actions: {
			goNext,
			goBack,
			onCopyLink,
			onQueueInvite,
			onRemoveInvite,
			onFinish,
		},
	};
}
