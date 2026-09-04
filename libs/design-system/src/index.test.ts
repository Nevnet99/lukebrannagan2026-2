import { beforeEach, describe, expect, it } from "vitest";
import { DsText, defineDesignSystem } from "./index";

describe("design system", () => {
	beforeEach(() => {
		defineDesignSystem();
	});

	it("registers custom elements", () => {
		expect(customElements.get("ds-text")).toBe(DsText);
		expect(customElements.get("ds-link")).toBeDefined();
		expect(customElements.get("ds-stack")).toBeDefined();
		expect(customElements.get("ds-container")).toBeDefined();
		expect(customElements.get("ds-rule")).toBeDefined();
		expect(customElements.get("ds-skip-links")).toBeDefined();
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
		expect(el.getAttribute("variant")).toBe("display");
		el.remove();
	});
});
