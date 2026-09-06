import { beforeEach, describe, expect, it } from "vitest";
import { defineDesignSystem } from "../../index";
import type { DsIcon } from "./icon";

describe("ds-icon", () => {
	beforeEach(() => {
		defineDesignSystem();
	});

	it("renders a Material Symbol as decorative svg by default", async () => {
		const el = document.createElement("ds-icon") as DsIcon;
		el.name = "dark_mode";
		document.body.appendChild(el);
		await el.updateComplete;

		const svg = el.shadowRoot?.querySelector("svg");
		expect(svg?.getAttribute("aria-hidden")).toBe("true");
		expect(svg?.querySelector("path")).toBeTruthy();
		el.remove();
	});

	it("names an icon when a label is provided", async () => {
		const el = document.createElement("ds-icon") as DsIcon;
		el.name = "light_mode";
		el.label = "Light mode";
		document.body.appendChild(el);
		await el.updateComplete;

		const svg = el.shadowRoot?.querySelector("svg");
		expect(svg?.getAttribute("role")).toBe("img");
		expect(svg?.getAttribute("aria-label")).toBe("Light mode");
		expect(svg?.hasAttribute("aria-hidden")).toBe(false);
		el.remove();
	});
});
