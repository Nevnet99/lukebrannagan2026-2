/** Average silent reading pace for technical prose */
const WORDS_PER_MINUTE = 220;

export function countWords(text: string): number {
	const cleaned = text
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/`[^`]*`/g, " ")
		.replace(/!\[[^\]]*]\([^)]*\)/g, " ")
		.replace(/\[[^\]]*]\([^)]*\)/g, " ")
		.replace(/[#>*_~-]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();
	if (!cleaned) return 0;
	return cleaned.split(" ").length;
}

export function readingMinutes(text: string): number {
	return Math.max(1, Math.ceil(countWords(text) / WORDS_PER_MINUTE));
}

export function readingTimeLabel(text: string): string {
	const minutes = readingMinutes(text);
	return minutes === 1 ? "1 min read" : `${minutes} min read`;
}
