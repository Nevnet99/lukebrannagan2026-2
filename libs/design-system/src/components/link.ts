import { css, html, LitElement, nothing } from "lit";

export class DsLink extends LitElement {
	static override styles = css`
		:host {
			display: inline-flex;
			align-items: center;
			min-height: var(--hit-min);
			vertical-align: middle;
		}

		:host([stretch]) {
			/* Stretch hit area is painted by a::after against a positioned ancestor. */
			position: static;
			min-height: 0;
			align-items: baseline;
		}

		a {
			display: inline-flex;
			align-items: center;
			min-height: inherit;
			color: var(--color-accent-text);
			text-decoration: underline;
			text-decoration-thickness: from-font;
			text-underline-position: from-font;
			text-underline-offset: 0.12em;
			text-decoration-skip-ink: auto;
			text-decoration-color: color-mix(
				in oklch,
				var(--color-accent-text) 40%,
				transparent
			);
		}

		:host([stretch]) a {
			position: static;
			z-index: 1;
			min-height: 0;
			align-items: baseline;
			line-height: var(--line-height-snug);
		}

		:host([stretch]) a::after {
			content: "";
			position: absolute;
			inset: 0;
			z-index: 1;
			border-radius: var(--radius-md);
		}

		@media (prefers-reduced-motion: no-preference) {
			a {
				transition-property: text-decoration-color, color;
				transition-duration: var(--duration-fast);
				transition-timing-function: var(--ease-out);
			}
		}

		@media (hover: hover) {
			a:hover {
				color: var(--color-accent-hover);
				text-decoration-color: var(--color-accent-hover);
			}
		}

		a[aria-current="page"] {
			color: var(--color-fg);
			text-decoration: none;
		}

		a:focus-visible {
			outline: var(--focus-ring) solid var(--color-focus);
			outline-offset: var(--focus-offset);
		}

		/* Shadow DOM focus lives on <a>; ring the stretch layer so it matches the card. */
		:host([stretch]) a:focus-visible {
			outline: none;
		}

		:host([stretch]) a:focus-visible::after {
			outline: var(--focus-ring) solid var(--color-focus);
			outline-offset: var(--focus-offset);
		}

		@media (forced-colors: active) {
			a:focus-visible {
				outline: var(--focus-ring) solid Highlight;
			}

			:host([stretch]) a:focus-visible {
				outline: none;
			}

			:host([stretch]) a:focus-visible::after {
				outline: var(--focus-ring) solid Highlight;
			}
		}

		.visually-hidden {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			white-space: nowrap;
			border: 0;
		}
	`;

	static override properties = {
		href: { type: String },
		external: { type: Boolean },
		stretch: { type: Boolean, reflect: true },
		current: { type: String, reflect: true },
	};

	declare href: string;
	declare external: boolean;
	declare stretch: boolean;
	declare current: string | undefined;

	constructor() {
		super();
		this.href = "#";
		this.external = false;
		this.stretch = false;
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
				${
					this.isExternal
						? html`<span class="visually-hidden"> (opens in a new tab)</span>`
						: nothing
				}
			</a>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"ds-link": DsLink;
	}
}
