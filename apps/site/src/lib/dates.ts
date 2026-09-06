/** Locale-aware short date for writing lists and posts. */
export function formatPostDate(date: Date): string {
	return date.toLocaleDateString("en-GB", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

export function formatPostDateLong(date: Date): string {
	return date.toLocaleDateString("en-GB", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}
