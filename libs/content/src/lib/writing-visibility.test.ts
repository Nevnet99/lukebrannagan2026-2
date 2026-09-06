import { describe, expect, it } from "vitest";
import { isWritingPubliclyLinked } from "./writing-visibility";

describe("isWritingPubliclyLinked", () => {
	it("allows normal listed posts", () => {
		expect(isWritingPubliclyLinked({})).toBe(true);
		expect(isWritingPubliclyLinked({ listed: true })).toBe(true);
		expect(isWritingPubliclyLinked({ reviewStatus: "published" })).toBe(true);
	});

	it("hides unlisted and to-be-reviewed stubs", () => {
		expect(isWritingPubliclyLinked({ listed: false })).toBe(false);
		expect(isWritingPubliclyLinked({ reviewStatus: "to-be-reviewed" })).toBe(false);
		expect(isWritingPubliclyLinked({ listed: false, reviewStatus: "to-be-reviewed" })).toBe(false);
	});
});
