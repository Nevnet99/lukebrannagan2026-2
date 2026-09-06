import { beforeEach, describe, expect, it } from "vitest";
import { DsLink, DsText, defineDesignSystem } from "./index";

describe("design system", () => {
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

	it("renders breadcrumb links and a current page crumb", async () => {
		const el = document.createElement(
			"ds-breadcrumb",
		) as import("./components/breadcrumb").DsBreadcrumb;
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

	it("renders a Material Symbol as decorative svg by default", async () => {
		const el = document.createElement("ds-icon") as import("./components/icon").DsIcon;
		el.name = "dark_mode";
		document.body.appendChild(el);
		await el.updateComplete;

		const svg = el.shadowRoot?.querySelector("svg");
		expect(svg?.getAttribute("aria-hidden")).toBe("true");
		expect(svg?.querySelector("path")).toBeTruthy();
		el.remove();
	});

	it("names an icon when a label is provided", async () => {
		const el = document.createElement("ds-icon") as import("./components/icon").DsIcon;
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

	it("renders a theme toggle as a labeled ds-switch", async () => {
		const el = document.createElement(
			"ds-theme-toggle",
		) as import("./components/theme-toggle").DsThemeToggle;
		document.body.appendChild(el);
		await el.updateComplete;

		const switchEl = el.shadowRoot?.querySelector("ds-switch") as
			| import("./components/switch").DsSwitch
			| null
			| undefined;
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

	it("renders a labeled checkbox switch", async () => {
		const el = document.createElement("ds-switch") as import("./components/switch").DsSwitch;
		el.label = "Archived";
		document.body.appendChild(el);
		await el.updateComplete;

		expect(el.shadowRoot?.textContent).toContain("Archived");
		expect(el.shadowRoot?.querySelector('input[type="checkbox"]')).toBeTruthy();
		el.remove();
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

	it("opens a popover on focus within the trigger", async () => {
		const el = document.createElement("ds-popover") as import("./components/popover").DsPopover;
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
