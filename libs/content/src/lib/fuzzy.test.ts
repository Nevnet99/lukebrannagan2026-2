import { describe, expect, it } from "vitest";
import { fuzzyMatch, fuzzyScore } from "./fuzzy";

describe("fuzzyScore", () => {
	it("returns 0 for an empty query", () => {
		expect(fuzzyScore("", "Zod validation")).toBe(0);
		expect(fuzzyScore("   ", "Zod validation")).toBe(0);
	});

	it("matches exact substrings ahead of sparse hits", () => {
		const exact = fuzzyScore("zod", "Using Zod for APIs");
		const sparse = fuzzyScore("zod", "z something o something d");
		expect(exact).not.toBeNull();
		expect(sparse).not.toBeNull();
		expect(exact!).toBeGreaterThan(sparse!);
	});

	it("matches out-of-order-tolerant sequential characters", () => {
		expect(fuzzyScore("ts", "TypeScript")).not.toBeNull();
		expect(fuzzyScore("qwerty", "Switching from QWERTY")).not.toBeNull();
		expect(fuzzyScore("xyzzy", "No match here")).toBeNull();
	});
});

describe("fuzzyMatch", () => {
	it("picks the best field score", () => {
		const score = fuzzyMatch("zod", ["Unrelated title", "Learn Zod schemas"]);
		expect(score).not.toBeNull();
		expect(score!).toBeGreaterThan(0);
	});

	it("returns null when no field matches", () => {
		expect(fuzzyMatch("graphql", ["Zod", "Next.js costs"])).toBeNull();
	});
});
