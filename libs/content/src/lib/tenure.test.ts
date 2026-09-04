import { describe, expect, it } from "vitest";
import type { Experience } from "../experience";
import { formatTenure } from "./tenure";

const base: Experience = {
	slug: "test",
	role: "Engineer",
	company: "Test Co",
	period: "Jan 2020 – Dec 2020",
	start: "2020-01",
	end: "2020-12",
	tags: [],
	highlights: [],
};

describe("formatTenure", () => {
	it("formats a single month", () => {
		expect(formatTenure({ ...base, start: "2020-01", end: "2020-01" })).toBe("1 month");
	});

	it("formats months under a year", () => {
		expect(formatTenure({ ...base, start: "2020-01", end: "2020-06" })).toBe("6 months");
	});

	it("formats exact years", () => {
		expect(formatTenure({ ...base, start: "2020-01", end: "2021-12" })).toBe("2 years");
	});

	it("formats years and months", () => {
		expect(formatTenure({ ...base, start: "2020-01", end: "2021-03" })).toBe("1 year 3 months");
	});

	it("uses now when end is omitted", () => {
		const now = new Date(2024, 6, 1); // July 2024
		expect(formatTenure({ ...base, start: "2023-07", end: undefined }, now)).toBe("1 year 1 month");
	});
});
