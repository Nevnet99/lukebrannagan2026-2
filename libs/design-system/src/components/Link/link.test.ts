import { beforeEach, describe, expect, it } from "vitest";
import { type DsLink, defineDesignSystem } from "../../index";

describe("ds-link", () => {
	beforeEach(() => {
		defineDesignSystem();
	});

	it("announces external links that open in a new tab", async () => {
		const el = document.createElement("ds-link") as DsLink;
		el.href = "https://example.com";
		el.textContent = "Example";
		document.body.appendChild(el);
		await el.updateComplete;

		const anchor = el.shadowRoot?.querySelector("a");
		expect(anchor?.getAttribute("target")).toBe("_blank");
		expect(anchor?.getAttribute("rel")).toBe("noopener noreferrer");
		expect(anchor?.textContent).toContain("opens in a new tab");
		el.remove();
	});

	it("marks stretch links for card hit areas", async () => {
		const el = document.createElement("ds-link") as DsLink;
		el.href = "/work/kroo-design-system";
		el.stretch = true;
		el.textContent = "Kroo";
		document.body.appendChild(el);
		await el.updateComplete;

		expect(el.hasAttribute("stretch")).toBe(true);
		el.remove();
	});
});
