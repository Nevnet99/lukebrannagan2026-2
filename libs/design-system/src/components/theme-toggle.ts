import { css, html, LitElement } from "lit";
import { applyTheme, resolveTheme, setTheme, type Theme } from "../theme";
import type { DsSwitch } from "./switch";

/**
 * Theme preference control — icon switch with an accessible “Theme” name.
 * Checked means dark theme.
 */
export class DsThemeToggle extends LitElement {
	static override styles = css`
		:host {
			display: inline-flex;
			flex-shrink: 0;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
			inline-size: 2.25rem;
			min-inline-size: 2.25rem;
			max-inline-size: 2.25rem;
			min-block-size: var(--hit-min);
			vertical-align: middle;
		}
	`;

	static override properties = {
		theme: { type: String, state: true },
	};

	declare theme: Theme;

	#media: MediaQueryList | null = null;

	constructor() {
		super();
		this.theme = "light";
	}

	override connectedCallback() {
		super.connectedCallback();
		this.theme = resolveTheme();
		applyTheme(this.theme);

		this.#media = window.matchMedia("(prefers-color-scheme: dark)");
		this.#media.addEventListener("change", this.#onSystemChange);
		window.addEventListener("storage", this.#onStorage);
	}

	override disconnectedCallback() {
		this.#media?.removeEventListener("change", this.#onSystemChange);
		window.removeEventListener("storage", this.#onStorage);
		super.disconnectedCallback();
	}

	#onSystemChange = () => {
		if (localStorage.getItem("theme") == null) {
			this.theme = resolveTheme();
			applyTheme(this.theme);
		}
	};

	#onStorage = (event: StorageEvent) => {
		if (event.key !== "theme") return;
		this.theme = resolveTheme();
		applyTheme(this.theme);
	};

	#onChange = (event: Event) => {
		const switchEl = event.target as DsSwitch;
		const next: Theme = switchEl.checked ? "dark" : "light";
		setTheme(next);
		this.theme = next;
	};

	override render() {
		const icon = this.theme === "dark" ? "dark_mode" : "light_mode";

		return html`
			<ds-switch
				label="Theme"
				hide-label
				name="theme"
				icon=${icon}
				.checked=${this.theme === "dark"}
				@change=${this.#onChange}
			></ds-switch>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"ds-theme-toggle": DsThemeToggle;
	}
}
