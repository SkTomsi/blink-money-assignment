import { useState } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";

type TextFieldProps = {
	label: string;
	hint?: string;
	error?: string;
} & Omit<TextInputProps, "style">;

export function TextField({
	label,
	hint,
	error,
	value,
	onChangeText,
	...rest
}: TextFieldProps) {
	const [focused, setFocused] = useState(false);
	const showError = Boolean(error);

	return (
		<View className="gap-1.5">
			<Text className="text-caption font-semibold uppercase tracking-wide text-textMuted">
				{label}
			</Text>
			<TextInput
				value={value}
				onChangeText={onChangeText}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
				placeholderTextColor="#8A9584"
				className={`rounded-xl border bg-surface px-4 py-3.5 text-body text-textPrimary ${
					focused ? "border-primary" : showError ? "border-red" : "border-border"
				}`}
				{...rest}
			/>
			{showError ? (
				<Text className="text-caption text-redDeep">{error}</Text>
			) : hint ? (
				<Text className="text-caption text-textMuted">{hint}</Text>
			) : null}
		</View>
	);
}