/**
 * Lightweight fuzzy match for short queries against titles/descriptions.
 * Returns a score (higher is better), or null when there is no match.
 */
export function fuzzyScore(query: string, text: string): number | null {
	const q = query.trim().toLowerCase();
	if (!q) return 0;

	const hay = text.toLowerCase();
	if (!hay) return null;

	const exact = hay.indexOf(q);
	if (exact !== -1) {
		// Prefer earlier, contiguous hits.
		return 1_000 - exact + q.length;
	}

	let qi = 0;
	let score = 0;
	let consecutive = 0;
	let lastMatch = -2;

	for (let i = 0; i < hay.length && qi < q.length; i++) {
		if (hay[i] !== q[qi]) continue;
		consecutive = i === lastMatch + 1 ? consecutive + 1 : 1;
		score += 1 + consecutive;
		lastMatch = i;
		qi += 1;
	}

	return qi === q.length ? score : null;
}

export function fuzzyMatch(query: string, fields: string[]): number | null {
	const q = query.trim();
	if (!q) return 0;

	let best: number | null = null;
	for (const field of fields) {
		const score = fuzzyScore(q, field);
		if (score == null) continue;
		if (best == null || score > best) best = score;
	}
	return best;
}
