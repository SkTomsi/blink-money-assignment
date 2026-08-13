const inr = new Intl.NumberFormat("en-IN", {
	maximumFractionDigits: 0,
});

export function formatINR(amount: number): string {
	return `₹${inr.format(amount)}`;
}

export function formatCompactINR(amount: number): string {
	if (amount >= 10000000) {
		return `₹${trimZeros(amount / 10000000)}Cr`;
	}
	if (amount >= 100000) {
		return `₹${trimZeros(amount / 100000)}L`;
	}
	if (amount >= 1000) {
		return `₹${trimZeros(amount / 1000)}K`;
	}
	return `₹${Math.round(amount)}`;
}

function trimZeros(value: number): string {
	const fixed = value.toFixed(1);
	return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
}