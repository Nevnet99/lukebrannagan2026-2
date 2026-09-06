import { beforeEach, describe, expect, it } from "vitest";
import { defineDesignSystem } from "../../index";
import type { DsSwitch } from "../Switch";
import type { DsThemeToggle } from "./theme-toggle";

describe("ds-theme-toggle", () => {
	beforeEach(() => {
		defineDesignSystem();
	});

	it("renders a theme toggle as a labeled ds-switch", async () => {
		const el = document.createElement("ds-theme-toggle") as DsThemeToggle;
		document.body.appendChild(el);
		await el.updateComplete;

		const switchEl = el.shadowRoot?.querySelector("ds-switch") as DsSwitch | null | undefined;
		expect(switchEl).toBeTruthy();
		expect(switchEl?.label).toBe("Theme");
		expect(switchEl?.hideLabel).toBe(true);
		expect(switchEl?.icon).toMatch(/^(light_mode|dark_mode)$/);
		await switchEl!.updateComplete;
		const input = switchEl?.shadowRoot?.querySelector("input");
		expect(input?.getAttribute("aria-label")).toBe("Theme");
		expect(switchEl?.shadowRoot?.querySelector(".label")).toBeNull();
		el.remove();
	});
});
