import { beforeEach, describe, expect, it } from "vitest";
import { defineDesignSystem } from "../../index";
import type { DsBreadcrumb } from "./breadcrumb";

describe("ds-breadcrumb", () => {
	beforeEach(() => {
		defineDesignSystem();
	});

	it("renders breadcrumb links and a current page crumb", async () => {
		const el = document.createElement("ds-breadcrumb") as DsBreadcrumb;
		el.items = [
			{ label: "Selected work", href: "/work" },
			{ label: "Kroo", href: "/work/series/kroo" },
			{ label: "Kroo CMS" },
		];
		document.body.appendChild(el);
		await el.updateComplete;

		const nav = el.shadowRoot?.querySelector("nav");
		expect(nav?.getAttribute("aria-label")).toBe("Breadcrumb");
		const links = el.shadowRoot?.querySelectorAll("a");
		expect(links?.length).toBe(2);
		expect(links?.[0]?.getAttribute("href")).toBe("/work");
		const current = el.shadowRoot?.querySelector("[aria-current='page']");
		expect(current?.textContent?.trim()).toBe("Kroo CMS");
		el.remove();
	});
});
