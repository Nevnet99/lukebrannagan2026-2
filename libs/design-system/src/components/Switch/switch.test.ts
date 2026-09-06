import { beforeEach, describe, expect, it } from "vitest";
import { defineDesignSystem } from "../../index";
import type { DsSwitch } from "./switch";

describe("ds-switch", () => {
	beforeEach(() => {
		defineDesignSystem();
	});

	it("renders a labeled checkbox switch", async () => {
		const el = document.createElement("ds-switch") as DsSwitch;
		el.label = "Archived";
		document.body.appendChild(el);
		await el.updateComplete;

		expect(el.shadowRoot?.textContent).toContain("Archived");
		expect(el.shadowRoot?.querySelector('input[type="checkbox"]')).toBeTruthy();
		el.remove();
	});
});
