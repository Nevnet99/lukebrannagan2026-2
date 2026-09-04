import type { Experience } from "../experience";

function monthIndex(value: string): number {
	const [year, month] = value.split("-").map(Number);
	return year * 12 + (month - 1);
}

/** Human tenure like "3 years" or "5 months" from start/end months. */
export function formatTenure(role: Experience, now = new Date()): string {
	const start = monthIndex(role.start);
	const end = role.end ? monthIndex(role.end) : now.getFullYear() * 12 + now.getMonth();
	const totalMonths = Math.max(1, end - start + 1);
	const years = Math.floor(totalMonths / 12);
	const months = totalMonths % 12;

	if (years === 0) return months === 1 ? "1 month" : `${months} months`;
	if (months === 0) return years === 1 ? "1 year" : `${years} years`;
	const yearLabel = years === 1 ? "1 year" : `${years} years`;
	const monthLabel = months === 1 ? "1 month" : `${months} months`;
	return `${yearLabel} ${monthLabel}`;
}
