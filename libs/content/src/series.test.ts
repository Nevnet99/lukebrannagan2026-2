import { describe, expect, it } from "vitest";
import {
	getSeries,
	getWorkSeriesMembers,
	getWorkSeriesSiblings,
	listFeaturedWorkEntries,
	listFeaturedWritingSeries,
	listWorkIndexEntries,
	seriesHref,
	seriesMemberCountLabel,
} from "./series";

describe("series", () => {
	it("resolves the Kroo work series and members in order", () => {
		const kroo = getSeries("kroo", "work");
		expect(kroo?.title).toBe("Kroo");
		expect(getWorkSeriesMembers(kroo!).map((p) => p.slug)).toEqual([
			"kroo-design-system",
			"kroo-cms",
			"kroo-rebrand",
		]);
	});

	it("collapses series into one work index entry", () => {
		const entries = listWorkIndexEntries();
		expect(entries.filter((e) => e.type === "series")).toHaveLength(1);
		expect(entries.some((e) => e.type === "item" && e.project.slug === "primer")).toBe(true);
		expect(entries.some((e) => e.type === "item" && e.project.slug.startsWith("kroo-"))).toBe(
			false,
		);
	});

	it("features the Kroo series on the home work list without duplicate members", () => {
		const entries = listFeaturedWorkEntries();
		expect(entries[0]).toMatchObject({ type: "series", series: { slug: "kroo" } });
		expect(entries.some((e) => e.type === "item" && e.project.slug === "primer")).toBe(true);
		expect(entries.some((e) => e.type === "item" && e.project.slug.startsWith("kroo-"))).toBe(
			false,
		);
	});

	it("returns siblings for series navigation", () => {
		const mid = getWorkSeriesSiblings("kroo-cms");
		expect(mid?.prev?.slug).toBe("kroo-design-system");
		expect(mid?.next?.slug).toBe("kroo-rebrand");
		expect(mid?.index).toBe(1);
		expect(mid?.total).toBe(3);
	});

	it("builds hub hrefs and count labels", () => {
		expect(seriesHref(getSeries("kroo", "work")!)).toBe("/work/series/kroo");
		expect(seriesHref(getSeries("book-reviews", "writing")!)).toBe("/writing/series/book-reviews");
		expect(seriesMemberCountLabel(3, "work")).toBe("3 case studies");
		expect(seriesMemberCountLabel(1, "writing")).toBe("1 post");
		expect(seriesMemberCountLabel(6, "writing", "bookshelf")).toBe("6 books");
		expect(seriesMemberCountLabel(20, "writing", "bookshelf")).toBe("20 books");
	});

	it("features the AI and craft writing series on the home writing list", () => {
		expect(listFeaturedWritingSeries().map((series) => series.slug)).toEqual(["ai-and-craft"]);
	});
});
