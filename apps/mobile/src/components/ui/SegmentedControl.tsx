import { Pressable, Text, View } from "react-native";

type SegmentedOption<T extends string> = {
	key: T;
	label: string;
	caption?: string;
};

export function SegmentedControl<T extends string>({
	options,
	value,
	onChange,
}: {
	options: SegmentedOption<T>[];
	value: T;
	onChange: (key: T) => void;
}) {
	return (
		<View className="flex-row gap-2">
			{options.map((option) => {
				const active = option.key === value;
				return (
					<View key={option.key} className="flex-1">
						<Pressable
							onPress={() => onChange(option.key)}
							className={`items-center justify-center rounded-xl border px-3 py-3 ${
								active
									? "border-primary bg-primarySoft"
									: "border-border bg-surface"
							}`}
							style={({ pressed }) =>
								pressed && { transform: [{ scale: 0.97 }] }
							}
						>
							<Text
								className={`text-body font-semibold ${
									active ? "text-primary" : "text-textSecondary"
								}`}
							>
								{option.label}
							</Text>
							{option.caption ? (
								<Text
									className={`mt-0.5 text-center text-micro ${
										active ? "text-primaryDeep" : "text-textMuted"
									}`}
								>
									{option.caption}
								</Text>
							) : null}
						</Pressable>
					</View>
				);
			})}
		</View>
	);
}
