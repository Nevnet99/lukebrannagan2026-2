import { beforeEach, describe, expect, it } from "vitest";
import { DsLink, DsText, defineDesignSystem } from "./index";

describe("design system registry", () => {
	beforeEach(() => {
		defineDesignSystem();
	});

	it("registers custom elements", () => {
		expect(customElements.get("ds-text")).toBe(DsText);
		expect(customElements.get("ds-link")).toBe(DsLink);
		expect(customElements.get("ds-stack")).toBeDefined();
		expect(customElements.get("ds-container")).toBeDefined();
		expect(customElements.get("ds-rule")).toBeDefined();
		expect(customElements.get("ds-icon")).toBeDefined();
		expect(customElements.get("ds-switch")).toBeDefined();
		expect(customElements.get("ds-skip-links")).toBeDefined();
		expect(customElements.get("ds-theme-toggle")).toBeDefined();
		expect(customElements.get("ds-breadcrumb")).toBeDefined();
		expect(customElements.get("ds-popover")).toBeDefined();
	});
});
