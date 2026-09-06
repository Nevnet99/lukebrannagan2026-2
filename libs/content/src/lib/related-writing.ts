export type RelatedWritingInput = {
	id: string;
	tags: readonly string[];
	series?: string | null;
	pubDate: Date;
	archived?: boolean;
	listed?: boolean;
};

export type RelatedWritingResult<T extends RelatedWritingInput> = T & {
	score: number;
};

/**
 * Rank other listed, non-archived posts by shared topics and series.
 * Tie-break: newer pubDate first.
 */
export function relatedWritingPosts<T extends RelatedWritingInput>(
	current: RelatedWritingInput,
	candidates: readonly T[],
	limit = 3,
): RelatedWritingResult<T>[] {
	const currentTags = new Set(current.tags.map((tag) => tag.toLowerCase()));
	const currentSeries = current.series?.trim() || null;

	const scored = candidates
		.filter((post) => {
			if (post.id === current.id) return false;
			if (post.archived) return false;
			if (post.listed === false) return false;
			return true;
		})
		.map((post) => {
			let score = 0;
			for (const tag of post.tags) {
				if (currentTags.has(tag.toLowerCase())) score += 2;
			}
			const postSeries = post.series?.trim() || null;
			if (currentSeries && postSeries && currentSeries === postSeries) {
				score += 3;
			}
			return { ...post, score };
		})
		.filter((post) => post.score > 0)
		.sort((a, b) => {
			if (b.score !== a.score) return b.score - a.score;
			return b.pubDate.valueOf() - a.pubDate.valueOf();
		});

	return scored.slice(0, limit);
}
