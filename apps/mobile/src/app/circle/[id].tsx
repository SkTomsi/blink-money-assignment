import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
	ActivityIndicator,
	Animated,
	Modal,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
import { CheckInCelebration } from "@/components/CheckInCelebration";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Screen } from "@/components/ui/Screen";
import { CURRENT_USER } from "@/data/users";
import { monthYearLabel, periodUnit } from "@/features/create-circle/constants";
import { copyText } from "@/lib/clipboard";
import { durationInPeriods } from "@/lib/dates";
import { formatCompactINR, formatINR } from "@/lib/format";
import { SIP_ANNUAL_RATE_PCT, sipProjection } from "@/lib/returns";
import { getActiveMembers, getPeriodProgress } from "@/lib/stats";
import {
	useCircle,
	useCircleStore,
	useMembers,
	useOverview,
	useUserMap,
} from "@/store/useCircleStore";
import type { CircleMember } from "@/types";

export default function CircleScreen() {
	const { id = "" } = useLocalSearchParams<{ id: string }>();
	const circle = useCircle(id);
	const overview = useOverview(id);
	const members = useMembers(id);
	const users = useUserMap();
	const router = useRouter();
	const checkIn = useCircleStore((s) => s.checkIn);
	const nudgeMember = useCircleStore((s) => s.nudgeMember);

	const [checking, setChecking] = useState(false);
	const [checkedBanner, setCheckedBanner] = useState(false);
	const [bannerText, setBannerText] = useState("");
	const [nudgingId, setNudgingId] = useState<string | null>(null);
	const [nudgingAll, setNudgingAll] = useState(false);
	const [nudgedIds, setNudgedIds] = useState<Set<string>>(new Set());
	const [shareOpen, setShareOpen] = useState(false);
	const [copied, setCopied] = useState(false);
	const [celebration, setCelebration] = useState<{
		amount: number;
		fromTotal: number;
		saved: boolean;
	} | null>(null);
	const bannerY = useRef(new Animated.Value(-80)).current;
	const bannerOpacity = useRef(new Animated.Value(0)).current;

	if (!circle || !overview) {
		return (
			<Screen>
				<View className="flex-1 items-center justify-center gap-3 px-8">
					<Text className="text-h3 text-textPrimary">Circle not found</Text>
					<Button
						label="Go back"
						variant="secondary"
						onPress={() => router.back()}
					/>
				</View>
			</Screen>
		);
	}

	const { total, progress, goal, streak, atRisk } = overview;
	const unit = periodUnit(circle.frequency);
	const unitPlural = streak === 1 ? unit : `${unit}s`;
	const periodTitle =
		circle.frequency === "daily"
			? "Today"
			: monthYearLabel(new Date().toISOString());
	const thisPeriodLabel = circle.frequency === "daily" ? "today" : "this month";
	const goalPct = Math.round(goal.pct * 100);
	const periodPct = Math.round(progress.pct * 100);
	const meCheckedIn = progress.completedUserIds.includes(CURRENT_USER.id);

	const dueMembers = members.filter((m) =>
		progress.dueUserIds.includes(m.userId),
	);
	const nudgeableDue = dueMembers.filter((m) => m.userId !== CURRENT_USER.id);
	const dueNames = nudgeableDue
		.map((m) => users[m.userId]?.name ?? "Someone")
		.join(", ");

	const projection = sipProjection(
		circle.contributionAmount,
		durationInPeriods(
			circle.frequency,
			circle.durationMonths,
			circle.targetDate,
		),
		circle.frequency === "monthly" ? 12 : 365,
	);

	const onCheckIn = async () => {
		if (checking || meCheckedIn) return;
		const wasAtRisk = atRisk;
		const fromTotal = total;
		setChecking(true);
		try {
			await checkIn(circle.id);
			const db = useCircleStore.getState().db!;
			const fresh = getPeriodProgress(
				circle,
				getActiveMembers(db, circle.id),
				db.checkIns.filter((c) => c.circleId === circle.id),
				new Date(),
			);
			const saved = wasAtRisk && fresh.dueUserIds.length === 0;
			setCelebration({
				amount: circle.contributionAmount,
				fromTotal,
				saved,
			});
		} catch {
			setBannerText("Something went wrong. Please try again.");
			setCheckedBanner(true);
			Animated.parallel([
				Animated.spring(bannerY, { toValue: 0, useNativeDriver: true }),
				Animated.timing(bannerOpacity, {
					toValue: 1,
					duration: 250,
					useNativeDriver: true,
				}),
			]).start();
		}
		setChecking(false);
	};

	const onNudge = async (userId: string) => {
		if (nudgingId) return;
		setNudgingId(userId);
		try {
			await nudgeMember(circle.id, userId);
			setNudgedIds((prev) => new Set(prev).add(userId));
		} catch {
			// no-op
		}
		setNudgingId(null);
	};

	const onNudgeAll = async () => {
		if (nudgingAll || nudgeableDue.length === 0) return;
		setNudgingAll(true);
		try {
			for (const m of nudgeableDue) {
				await nudgeMember(circle.id, m.userId);
				setNudgedIds((prev) => new Set(prev).add(m.userId));
			}
		} catch {
			// no-op
		}
		setNudgingAll(false);
	};

	const onCopyInvite = async () => {
		const ok = await copyText(
			`https://blinkmoney.in/join/${circle.inviteSlug}`,
		);
		if (ok) {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<Screen>
			<ScrollView contentContainerClassName="gap-4 px-5 pb-8 pt-3">
				<View className="flex-row items-center gap-3">
					<Pressable
						onPress={() => router.back()}
						hitSlop={12}
						className="h-10 w-10 items-center justify-center rounded-xl bg-surface"
						style={({ pressed }) =>
							pressed && { transform: [{ scale: 0.94 }], opacity: 0.8 }
						}
					>
						<Ionicons name="chevron-back" size={22} color="#8A9584" />
					</Pressable>
					<View className="h-11 w-11 items-center justify-center rounded-xl bg-primarySoft">
						<Text className="text-xl">{typeEmoji(circle.type)}</Text>
					</View>
					<View className="flex-1">
						<Text className="text-h4 text-textPrimary">{circle.name}</Text>
						<Text className="mt-0.5 text-caption text-textMuted">
							{typeLabel(circle.type)} · {freqLabel(circle.frequency)} ·{" "}
							{members.length} {members.length === 1 ? "member" : "members"}
						</Text>
					</View>
					<Pressable
						onPress={() => setShareOpen(true)}
						hitSlop={12}
						className="h-10 w-10 items-center justify-center rounded-xl bg-surface"
						style={({ pressed }) =>
							pressed && { transform: [{ scale: 0.94 }], opacity: 0.8 }
						}
					>
						<Ionicons name="share-outline" size={20} color="#8A9584" />
					</Pressable>
				</View>

				{checkedBanner ? (
					<Animated.View
						className="rounded-xl bg-primary px-4 py-3"
						style={{
							opacity: bannerOpacity,
							transform: [{ translateY: bannerY }],
						}}
					>
						<Text className="text-body font-semibold text-onPrimary">
							{bannerText}
						</Text>
					</Animated.View>
				) : null}

				<View className="gap-2 rounded-2xl bg-surface p-4">
					<Text className="text-caption font-semibold uppercase tracking-wide text-textMuted">
						Total invested
					</Text>
					<View className="flex-row items-baseline justify-between">
						<Text className="text-h3 font-bold tabular-nums text-textPrimary">
							{formatINR(total)}{" "}
							<Text className="text-caption font-medium text-textMuted">
								/ {formatINR(circle.targetAmount)}
							</Text>
						</Text>
						<Text className="text-caption font-semibold text-textMuted">
							{goalPct}%
						</Text>
					</View>
					<ProgressBar progress={goal.pct} />
					<Text className="text-caption text-textMuted">
						Target by {monthYearLabel(circle.targetDate)} · your{" "}
						{formatINR(circle.contributionAmount)}/{unit} could grow to ≈{" "}
						{formatCompactINR(projection)} (~{SIP_ANNUAL_RATE_PCT}% p.a.)
					</Text>
				</View>

				<View className="gap-2 rounded-2xl bg-surface p-4">
					<Text className="text-caption font-semibold uppercase tracking-wide text-textMuted">
						{periodTitle}
					</Text>
					<View className="flex-row items-baseline justify-between">
						<Text className="text-body font-semibold tabular-nums text-textPrimary">
							{formatINR(progress.invested)} / {formatINR(progress.target)}
						</Text>
						<Text className="text-caption font-semibold text-textMuted">
							{periodPct}%
						</Text>
					</View>
					<ProgressBar progress={progress.pct} />
					<Text className="text-caption text-textMuted">
						{progress.completedUserIds.length} of {members.length} members in
						{progress.dueUserIds.length > 0
							? ` · ${dueNames || "You"} still to check in`
							: " · all in 🔥"}
					</Text>
				</View>

				<View className="gap-3 rounded-2xl bg-surface p-4">
					{atRisk ? (
						<View className="flex-row items-center gap-3">
							<Text className="text-xl">⚠️</Text>
							<View className="flex-1">
								<Text className="text-body font-semibold text-textPrimary">
									Streak at risk
								</Text>
								<Text className="text-caption text-textSecondary">
									{nudgeableDue.length > 0
										? `${dueNames} ${nudgeableDue.length === 1 ? "hasn't" : "haven't"} invested ${thisPeriodLabel} yet`
										: "You haven't checked in yet"}
								</Text>
							</View>
							{nudgeableDue.length > 0 ? (
								<NudgeButton
									nudged={nudgeableDue.every((m) => nudgedIds.has(m.userId))}
									loading={nudgingAll}
									label={nudgeableDue.length > 1 ? "Nudge all" : "Nudge"}
									onPress={onNudgeAll}
								/>
							) : null}
						</View>
					) : (
						<View className="flex-row items-center gap-3">
							<Text className="text-xl">🔥</Text>
							<View>
								<Text className="text-body font-semibold text-textPrimary">
									{streak} {unitPlural} streak
								</Text>
								<Text className="text-caption text-textSecondary">
									{periodTitle} complete — keep it going
								</Text>
							</View>
						</View>
					)}
				</View>

				<View className="gap-3 rounded-2xl bg-surface p-4">
					<Text className="text-caption font-semibold uppercase tracking-wide text-textMuted">
						Members
					</Text>
					{members.map((m) => {
						const user = users[m.userId];
						if (!user) return null;
						const invested = progress.completedUserIds.includes(m.userId);
						return (
							<MemberRow
								key={m.id}
								member={m}
								name={user.name}
								username={user.username}
								avatarColor={user.avatarColor}
								invested={invested}
								nudged={nudgedIds.has(m.userId)}
								nudging={nudgingId === m.userId}
								onNudge={() => onNudge(m.userId)}
							/>
						);
					})}
				</View>
			</ScrollView>

			<View className="border-t border-border bg-bg px-5 py-3">
				<Button
					label={
						meCheckedIn
							? "✓ You're checked in"
							: circle.frequency === "daily"
								? "Check in today"
								: "Check in this month"
					}
					disabled={meCheckedIn || checking}
					onPress={onCheckIn}
				/>
			</View>

			<Modal
				visible={shareOpen}
				transparent
				animationType="slide"
				onRequestClose={() => setShareOpen(false)}
			>
				<View className="flex-1">
					<Pressable
						className="flex-1 bg-black/50"
						onPress={() => setShareOpen(false)}
					/>
					<View className="gap-4 rounded-t-3xl bg-surface p-5 pb-8">
						<Text className="text-h3 text-textPrimary">
							Share {circle.name}
						</Text>
						<View className="gap-3 rounded-3xl bg-primary p-6">
							<Text className="text-caption font-semibold uppercase tracking-wider text-onPrimary opacity-80">
								{circle.name.toUpperCase()}
							</Text>
							<Text className="text-h2 font-bold tabular-nums text-onPrimary">
								{formatCompactINR(total)}
							</Text>
							<Text className="text-caption font-semibold uppercase tracking-wider text-onPrimary opacity-80">
								invested together
							</Text>
							<ProgressBar
								progress={goal.pct}
								colorClass="bg-white"
								trackClass="bg-white/25"
							/>
							<Text className="text-caption text-onPrimary">
								{goalPct}% of {formatCompactINR(circle.targetAmount)} ·{" "}
								{members.length} members
								{streak > 0 ? ` · 🔥 ${streak} ${unitPlural}` : ""}
							</Text>
							<Text className="text-body font-semibold text-onPrimary">
								Building wealth together.
							</Text>
							<Text className="text-caption text-onPrimary opacity-70">
								Powered by BlinkMoney
							</Text>
						</View>
						<Button
							label={copied ? "Invite link copied ✓" : "Copy invite link"}
							onPress={onCopyInvite}
						/>
						<Button
							label="Done"
							variant="secondary"
							onPress={() => setShareOpen(false)}
						/>
					</View>
				</View>
			</Modal>

			<CheckInCelebration
				visible={celebration !== null}
				amount={celebration?.amount ?? 0}
				fromTotal={celebration?.fromTotal ?? 0}
				toTotal={(celebration?.fromTotal ?? 0) + (celebration?.amount ?? 0)}
				targetAmount={circle.targetAmount}
				saved={celebration?.saved ?? false}
				onClose={() => setCelebration(null)}
			/>
		</Screen>
	);
}

function MemberRow({
	member,
	name,
	username,
	avatarColor,
	invested,
	nudged,
	nudging,
	onNudge,
}: {
	member: CircleMember;
	name: string;
	username: string;
	avatarColor: string;
	invested: boolean;
	nudged: boolean;
	nudging: boolean;
	onNudge: () => void;
}) {
	const isYou = member.userId === CURRENT_USER.id;
	return (
		<View className="flex-row items-center gap-3">
			<Avatar color={avatarColor} name={name} size={34} />
			<View className="flex-1">
				<Text className="text-body font-semibold text-textPrimary">
					{name}
					{isYou ? (
						<Text className="font-medium text-textMuted"> (you)</Text>
					) : null}
				</Text>
				<Text className="text-caption text-textMuted">{username}</Text>
			</View>
			{invested ? (
				<View className="rounded-full bg-primarySoft px-2.5 py-1">
					<Text className="text-micro font-semibold text-primaryDeep">
						✓ Invested
					</Text>
				</View>
			) : (
				<NudgeButton
					nudged={nudged}
					loading={nudging}
					onPress={onNudge}
					disabledSelf={isYou}
				/>
			)}
		</View>
	);
}

function NudgeButton({
	nudged,
	loading,
	onPress,
	disabledSelf,
	label = "Nudge",
}: {
	nudged: boolean;
	loading: boolean;
	onPress: () => void;
	disabledSelf?: boolean;
	label?: string;
}) {
	return (
		<Pressable
			onPress={onPress}
			disabled={nudged || loading || disabledSelf}
			className="min-w-[74px] items-center justify-center rounded-full bg-primarySoft px-3 py-1.5"
			style={({ pressed }) =>
				pressed && !disabledSelf && { transform: [{ scale: 0.96 }] }
			}
		>
			{disabledSelf ? (
				<Text className="text-caption text-textSecondary">○ Due</Text>
			) : nudged ? (
				<Text className="text-micro font-semibold text-primary">
					Nudged 👉🏻
				</Text>
			) : loading ? (
				<ActivityIndicator size={12} color="#4E7A2E" />
			) : (
				<Text className="text-micro font-semibold text-primary">
					{label} 👉🏻
				</Text>
			)}
		</Pressable>
	);
}

const TYPE_LABELS: Record<string, string> = {
	family: "Family",
	couple: "Couple",
	friends: "Friends",
};

const TYPE_EMOJIS: Record<string, string> = {
	family: "🏡",
	couple: "💛",
	friends: "🤝",
};

const FREQ_LABELS: Record<string, string> = {
	daily: "Daily",
	monthly: "Monthly",
};

const typeLabel = (type: string) => TYPE_LABELS[type] ?? type;
const typeEmoji = (type: string) => TYPE_EMOJIS[type] ?? "💰";
const freqLabel = (freq: string) => FREQ_LABELS[freq] ?? freq;
