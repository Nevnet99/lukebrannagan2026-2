import { describe, expect, it } from "vitest";
import { amazonProductUrl, bookCoverSrc } from "./amazon";

describe("amazonProductUrl", () => {
	it("builds a tagged dp link from an ASIN", () => {
		expect(
			amazonProductUrl({
				title: "Atomic Habits",
				asin: "0735211299",
				tag: "lukebrannagan-21",
			}),
		).toBe("https://www.amazon.co.uk/dp/0735211299?tag=lukebrannagan-21");
	});

	it("converts ISBN-13 to ISBN-10 for /dp/", () => {
		expect(
			amazonProductUrl({
				title: "Designing Data-Intensive Applications",
				isbn: "978-1-449-37332-0",
			}),
		).toBe("https://www.amazon.co.uk/dp/1449373321");
	});

	it("falls back to a title search when no identifier exists", () => {
		const url = amazonProductUrl({
			title: "Mystery Book",
			author: "Someone",
			tag: "luke-21",
		});
		expect(url).toContain("https://www.amazon.co.uk/s?");
		expect(url).toContain("tag=luke-21");
		expect(url).toContain("Mystery");
	});
});

describe("bookCoverSrc", () => {
	it("prefers an explicit cover path", () => {
		expect(
			bookCoverSrc({
				slug: "ddia",
				cover: "/covers/books/ddia.jpg",
				isbn: "9781449373320",
			}),
		).toBe("/covers/books/ddia.jpg");
	});

	it("uses Open Library when only ISBN is set", () => {
		expect(bookCoverSrc({ slug: "ddia", isbn: "978-1449373320" })).toBe(
			"https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg",
		);
	});
});
