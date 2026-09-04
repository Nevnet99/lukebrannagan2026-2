import { css, html, LitElement, nothing } from "lit";

export class DsLink extends LitElement {
	static override styles = css`
		:host {
			display: inline;
		}

		a {
			color: var(--color-fg);
			text-decoration: underline;
			text-decoration-thickness: 1px;
			text-underline-offset: 0.2em;
			text-decoration-color: color-mix(in srgb, var(--color-fg) 35%, transparent);
			transition: text-decoration-color var(--duration-fast) var(--ease-out);
		}

		a:hover {
			text-decoration-color: var(--color-fg);
		}

		a[aria-current="page"] {
			text-decoration: none;
			font-weight: var(--font-weight-medium);
		}

		a:focus {
			outline: none;
		}

		a:focus-visible {
			outline: var(--focus-ring) solid var(--color-focus);
			outline-offset: var(--focus-offset);
		}
	`;

	static override properties = {
		href: { type: String },
		external: { type: Boolean },
		current: { type: String, reflect: true },
	};

	declare href: string;
	declare external: boolean;
	declare current: string | undefined;

	constructor() {
		super();
		this.href = "#";
		this.external = false;
		this.current = undefined;
	}

	private get isExternal() {
		return this.external || /^https?:\/\//.test(this.href);
	}

	override render() {
		return html`
			<a
				part="anchor"
				href=${this.href}
				aria-current=${this.current || nothing}
				target=${this.isExternal ? "_blank" : nothing}
				rel=${this.isExternal ? "noopener noreferrer" : nothing}
			>
				<slot></slot>
			</a>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"ds-link": DsLink;
	}
}
