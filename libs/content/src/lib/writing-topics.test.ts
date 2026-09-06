import { describe, expect, it } from "vitest";
import {
	isWritingTopicId,
	sortWritingTopicIds,
	writingTopicLabel,
	writingTopics,
} from "../writing-topics";

describe("writing-topics", () => {
	it("exposes a short canonical set", () => {
		expect(writingTopics.length).toBeLessThanOrEqual(6);
	});

	it("labels known ids", () => {
		expect(writingTopicLabel("react")).toBe("React");
		expect(writingTopicLabel("typescript")).toBe("TypeScript");
		expect(isWritingTopicId("craft")).toBe(true);
		expect(isWritingTopicId("zod")).toBe(false);
	});

	it("sorts by canonical order", () => {
		expect(sortWritingTopicIds(["craft", "react", "accessibility"])).toEqual([
			"react",
			"accessibility",
			"craft",
		]);
	});
});
