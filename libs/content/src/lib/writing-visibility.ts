/** Posts that appear in feeds, series hubs, and the public sitemap. */
export function isWritingPubliclyLinked(data: {
	listed?: boolean;
	reviewStatus?: "to-be-reviewed" | "published";
}): boolean {
	if (data.listed === false) return false;
	if (data.reviewStatus === "to-be-reviewed") return false;
	return true;
}
