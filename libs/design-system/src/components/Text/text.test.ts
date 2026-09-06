import { beforeEach, describe, expect, it } from "vitest";
import { type DsText, defineDesignSystem } from "../../index";

describe("ds-text", () => {
	beforeEach(() => {
		defineDesignSystem();
	});

	it("renders text with the requested variant", async () => {
		const el = document.createElement("ds-text") as DsText;
		el.variant = "display";
		el.as = "h1";
		el.textContent = "Hello";
		document.body.appendChild(el);
		await el.updateComplete;

		const heading = el.shadowRoot?.querySelector("h1");
		expect(heading).toBeTruthy();
		expect(heading?.id).toBe("");
		expect(el.getAttribute("variant")).toBe("display");
		el.remove();
	});
});
