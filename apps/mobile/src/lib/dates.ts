import type { Frequency } from "../types";

export function toKey(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

export function todayKey(): string {
	return toKey(new Date());
}

export function monthKeyOf(date: Date): string {
	return toKey(date).slice(0, 7);
}

export function currentMonthKey(): string {
	return monthKeyOf(new Date());
}

export function addDays(date: Date, days: number): Date {
	const next = new Date(date);
	next.setDate(next.getDate() + days);
	return next;
}

export function addMonths(date: Date, months: number): Date {
	const next = new Date(date);
	next.setDate(1);
	next.setMonth(next.getMonth() + months);
	return next;
}

export function periodKeyFor(date: Date, frequency: Frequency): string {
	return frequency === "daily" ? toKey(date) : monthKeyOf(date);
}

export function previousPeriod(
	periodKey: string,
	frequency: Frequency
): string {
	const [y, m, d] = periodKey.split("-").map(Number);
	if (frequency === "daily") {
		return toKey(new Date(y, m - 1, d - 1));
	}
	return toKey(new Date(y, m - 2, 1)).slice(0, 7);
}

export function nowIso(): string {
	return new Date().toISOString();
}

export function hoursAgo(n: number): string {
	return addDays(new Date(), 0).toISOString().replace(
		/T\d+:/,
		`T${String(Math.max(0, 23 - n)).padStart(2, "0")}:`
	);
}

export function daysAgo(n: number): string {
	return addDays(new Date(), -n).toISOString();
}

export function monthsAgo(n: number): string {
	return addMonths(new Date(), -n).toISOString();
}

export function timeAgo(iso: string): string {
	const diff = Date.now() - new Date(iso).getTime();
	if (diff < 0) return "now";
	const minutes = Math.floor(diff / 60000);
	if (minutes < 1) return "now";
	if (minutes < 60) return `${minutes}m`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h`;
	const days = Math.floor(hours / 24);
	if (days === 1) return "yesterday";
	if (days < 7) return `${days}d`;
	return `${Math.floor(days / 7)}w`;
}