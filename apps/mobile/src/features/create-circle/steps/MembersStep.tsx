import { Pressable, Text, View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import type { User } from "@/types";
import { Step } from "../StepShell";

export function MembersStep({
	query,
	results,
	invitedUsers,
	invitingId,
	creating,
	error,
	inviteLink,
	copied,
	onQueryChange,
	onInvite,
	onRemove,
	onCopyLink,
	onFinish,
}: {
	query: string;
	results: User[];
	invitedUsers: User[];
	invitingId: string | null;
	creating: boolean;
	error: string | null;
	inviteLink: string;
	copied: boolean;
	onQueryChange: (query: string) => void;
	onInvite: (user: User) => void;
	onRemove: (userId: string) => void;
	onCopyLink: () => void;
	onFinish: () => void;
}) {
	return (
		<Step>
			<View className="gap-5">
				{invitedUsers.length > 0 ? (
					<View className="gap-2">
						<Text className="text-caption font-semibold uppercase tracking-wide text-textMuted">
							Invited ({invitedUsers.length})
						</Text>
						<View className="gap-2">
							{invitedUsers.map((user) => (
								<MemberRow
									key={user.id}
									user={user}
									invited
									onRemove={() => onRemove(user.id)}
								/>
							))}
						</View>
					</View>
				) : (
					<View className="rounded-2xl border border-dashed border-borderBright bg-surface p-4">
						<Text className="text-body font-semibold text-textPrimary">
							Just you for now
						</Text>
						<Text className="mt-0.5 text-caption text-textSecondary">
							You can invite people from your circle anytime.
						</Text>
					</View>
				)}

				<View className="gap-2">
					<TextField
						label="Add people"
						value={query}
						onChangeText={onQueryChange}
						placeholder="Search name or @username"
						clearButtonMode="while-editing"
					/>
					{results.length > 0 ? (
						<View className="gap-2">
							{results.slice(0, 5).map((user) => (
								<MemberRow
									key={user.id}
									user={user}
									inviting={invitingId === user.id}
									onInvite={() => onInvite(user)}
								/>
							))}
						</View>
					) : query.trim() ? (
						<Text className="text-caption text-textMuted">
							No one found for “{query.trim()}”
						</Text>
					) : null}
				</View>

				<View className="gap-2">
					<Text className="text-caption font-semibold uppercase tracking-wide text-textMuted">
						Share invite link
					</Text>
					<Pressable
						onPress={onCopyLink}
						className="flex-row items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
						style={({ pressed }) => pressed && { transform: [{ scale: 0.98 }] }}
					>
						<Text className="flex-1 text-caption text-textSecondary">
							{inviteLink}
						</Text>
						<Text className="ml-3 text-caption font-semibold text-primaryDeep">
							{copied ? "Copied ✓" : "Copy"}
						</Text>
					</Pressable>
				</View>

				{error ? (
					<Text className="text-caption font-medium text-redDeep">{error}</Text>
				) : null}

				<Button
					label={creating ? "Creating your circle…" : "Finish"}
					onPress={onFinish}
					disabled={creating}
				/>
			</View>
		</Step>
	);
}

export function MemberRow({
	user,
	invited = false,
	inviting = false,
	onInvite,
	onRemove,
}: {
	user: User;
	invited?: boolean;
	inviting?: boolean;
	onInvite?: () => void;
	onRemove?: () => void;
}) {
	return (
		<View className="flex-row items-center gap-3 rounded-2xl border border-border bg-surface p-3">
			<Avatar color={user.avatarColor} name={user.name} size={40} />
			<View className="flex-1">
				<Text className="text-body font-semibold text-textPrimary">
					{user.name}
				</Text>
				<Text className="text-caption text-textMuted">{user.username}</Text>
			</View>
			{invited ? (
				<View className="flex-row items-center gap-2">
					<View className="rounded-full bg-primarySoft px-2.5 py-1">
						<Text className="text-micro font-semibold text-primaryDeep">
							Invited
						</Text>
					</View>
					{onRemove ? (
						<Pressable
							onPress={onRemove}
							hitSlop={8}
							className="h-8 w-8 items-center justify-center rounded-full bg-bg"
						>
							<Text className="text-caption text-textSecondary">✕</Text>
						</Pressable>
					) : null}
				</View>
			) : (
				<Pressable
					onPress={onInvite}
					disabled={inviting}
					className={`rounded-xl px-4 py-2 ${inviting ? "bg-border" : "bg-primary"}`}
					style={({ pressed }) => pressed && { transform: [{ scale: 0.96 }] }}
				>
					<Text
						className={`text-caption font-semibold ${
							inviting ? "text-textMuted" : "text-onPrimary"
						}`}
					>
						{inviting ? "Adding…" : "Invite"}
					</Text>
				</Pressable>
			)}
		</View>
	);
}