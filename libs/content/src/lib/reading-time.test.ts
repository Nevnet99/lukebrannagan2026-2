import { describe, expect, it } from "vitest";
import { countWords, readingMinutes, readingTimeLabel } from "./reading-time";

describe("reading-time", () => {
	it("counts plain words", () => {
		expect(countWords("one two three")).toBe(3);
	});

	it("strips markdown noise before counting", () => {
		expect(countWords("# Title\n\nHello `code` and [link](https://x.com)")).toBe(3);
	});

	it("returns at least one minute", () => {
		expect(readingMinutes("short")).toBe(1);
		expect(readingTimeLabel("short")).toBe("1 min read");
	});

	it("ceilings longer text into minutes", () => {
		const words = Array.from({ length: 440 }, () => "word").join(" ");
		expect(readingMinutes(words)).toBe(2);
		expect(readingTimeLabel(words)).toBe("2 min read");
	});
});
