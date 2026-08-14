export const SIP_ANNUAL_RATE_PCT = 15;

export function sipProjection(
	perPeriod: number,
	periods: number,
	periodsPerYear: number,
	annualRatePct = SIP_ANNUAL_RATE_PCT,
): number {
	if (perPeriod <= 0 || periods <= 0) return 0;
	const rate = annualRatePct / 100 / periodsPerYear;
	const growth = Math.pow(1 + rate, periods);
	const futureValue = perPeriod * ((growth - 1) / rate) * (1 + rate);
	return Math.round(futureValue);
}
