import { describe, expect, it } from "vitest";
import { relatedWritingPosts } from "./related-writing";

const day = (iso: string) => new Date(iso);

describe("relatedWritingPosts", () => {
	const current = {
		id: "zod",
		tags: ["typescript"],
		pubDate: day("2026-02-03"),
	};

	const pool = [
		{
			id: "usecallback-and-usememo",
			tags: ["react", "typescript"],
			pubDate: day("2025-06-01"),
		},
		{
			id: "the-hidden-cost-of-next",
			tags: ["react", "performance"],
			pubDate: day("2025-08-01"),
		},
		{
			id: "learning-in-2025",
			tags: ["career"],
			pubDate: day("2025-01-01"),
		},
		{
			id: "old-typescript",
			tags: ["typescript"],
			pubDate: day("2024-01-01"),
			archived: true,
		},
		{
			id: "draft-typescript",
			tags: ["typescript"],
			pubDate: day("2026-03-01"),
			listed: false,
		},
	];

	it("ranks shared topics and skips archived or unlisted posts", () => {
		const related = relatedWritingPosts(current, pool, 3);
		expect(related.map((post) => post.id)).toEqual(["usecallback-and-usememo"]);
		expect(related[0]?.score).toBe(2);
	});

	it("boosts same-series posts above topic-only matches", () => {
		const related = relatedWritingPosts(
			{ id: "atomic-habits", tags: ["books"], series: "book-reviews", pubDate: day("2026-01-01") },
			[
				{
					id: "ddia",
					tags: ["books"],
					series: "book-reviews",
					pubDate: day("2025-12-01"),
				},
				{
					id: "unrelated-books-tag",
					tags: ["books"],
					pubDate: day("2026-02-01"),
				},
			],
			3,
		);
		expect(related.map((post) => post.id)).toEqual(["ddia", "unrelated-books-tag"]);
		expect(related[0]?.score).toBe(5);
		expect(related[1]?.score).toBe(2);
	});

	it("returns an empty list when nothing shares a topic or series", () => {
		expect(
			relatedWritingPosts(current, [
				{ id: "patterns", tags: ["architecture"], pubDate: day("2025-09-25") },
			]),
		).toEqual([]);
	});

	it("excludes the current post", () => {
		expect(relatedWritingPosts(current, [current])).toEqual([]);
	});
});
