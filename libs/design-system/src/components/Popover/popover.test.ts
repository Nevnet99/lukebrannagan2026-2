import { beforeEach, describe, expect, it } from "vitest";
import { defineDesignSystem } from "../../index";
import type { DsPopover } from "./popover";

describe("ds-popover", () => {
	beforeEach(() => {
		defineDesignSystem();
	});

	it("opens a popover on focus within the trigger", async () => {
		const el = document.createElement("ds-popover") as DsPopover;
		el.innerHTML = `
			<button slot="trigger" type="button">Open</button>
			<div slot="content">Details</div>
		`;
		document.body.appendChild(el);
		await el.updateComplete;

		const button = el.querySelector("button");
		button?.focus();
		el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
		await el.updateComplete;

		expect(el.open).toBe(true);
		expect(el.shadowRoot?.querySelector(".panel")).toBeTruthy();
		el.remove();
	});
});
