import { Text, View } from "react-native";

export function Avatar({
	color,
	name,
	size = 32,
}: {
	color: string;
	name: string;
	size?: number;
}) {
	const initial = name.trim().charAt(0).toUpperCase() || "?";
	return (
		<View
			style={{
				width: size,
				height: size,
				borderRadius: size / 2,
				backgroundColor: color,
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Text
				style={{
					color: "#FFFFFF",
					fontSize: size * 0.42,
					fontWeight: "700",
				}}
			>
				{initial}
			</Text>
		</View>
	);
}