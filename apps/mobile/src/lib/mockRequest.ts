export type MockRequestOptions = {
	minMs?: number;
	maxMs?: number;
	fail?: boolean;
};

/**
 * Simulates a network round-trip against a mocked service layer (PRD §31).
 * Adds 300-700ms of latency by default so loading states are demonstrable.
 */
export async function mockRequest<T>(
	run: () => T,
	options: MockRequestOptions = {}
): Promise<T> {
	const { minMs = 300, maxMs = 700, fail = false } = options;
	const latency = minMs + Math.random() * (maxMs - minMs);
	await delay(latency);
	if (fail) {
		throw new Error("Something went wrong. Please try again.");
	}
	return run();
}

export function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}