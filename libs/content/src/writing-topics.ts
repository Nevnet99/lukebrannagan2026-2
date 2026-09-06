/** Canonical writing topics — keep this short so filters stay scannable. */
export const writingTopics = [
	{ id: "react", label: "React" },
	{ id: "typescript", label: "TypeScript" },
	{ id: "accessibility", label: "Accessibility" },
	{ id: "architecture", label: "Architecture" },
	{ id: "tooling", label: "Tooling" },
	{ id: "craft", label: "Craft" },
] as const;

export type WritingTopicId = (typeof writingTopics)[number]["id"];

const labelById = Object.fromEntries(
	writingTopics.map((topic) => [topic.id, topic.label]),
) as Record<WritingTopicId, string>;

export function isWritingTopicId(value: string): value is WritingTopicId {
	return value in labelById;
}

export function writingTopicLabel(id: string): string {
	return isWritingTopicId(id) ? labelById[id] : id;
}

/** Stable filter order; unknown ids fall to the end alphabetically. */
export function sortWritingTopicIds(ids: string[]): string[] {
	const rank = new Map(writingTopics.map((topic, index) => [topic.id, index]));
	return [...new Set(ids.map((id) => id.toLowerCase()))].sort((a, b) => {
		const ra = rank.get(a as WritingTopicId);
		const rb = rank.get(b as WritingTopicId);
		if (ra != null && rb != null) return ra - rb;
		if (ra != null) return -1;
		if (rb != null) return 1;
		return a.localeCompare(b);
	});
}
