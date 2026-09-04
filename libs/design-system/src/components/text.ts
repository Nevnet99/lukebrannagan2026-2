import { css, html, LitElement, nothing } from "lit";
import type { TextTag, TextVariant } from "../types";

export class DsText extends LitElement {
	static override styles = css`
		:host {
			display: block;
			max-width: var(--measure);
		}

		[part="text"] {
			margin: 0;
		}

		:host([variant="display"]) [part="text"] {
			font-size: var(--font-size-2xl);
			font-weight: var(--font-weight-medium);
			line-height: var(--line-height-tight);
			letter-spacing: var(--letter-spacing-tight);
		}

		:host([variant="title"]) [part="text"] {
			font-size: var(--font-size-lg);
			font-weight: var(--font-weight-medium);
			line-height: var(--line-height-snug);
		}

		:host([variant="body"]) [part="text"] {
			font-size: var(--font-size-md);
			line-height: var(--line-height-normal);
			color: var(--color-fg);
		}

		:host([variant="meta"]) [part="text"] {
			font-family: var(--font-meta);
			font-size: var(--font-size-xs);
			letter-spacing: var(--letter-spacing-meta);
			color: var(--color-fg-muted);
			text-transform: uppercase;
		}

		:host([variant="muted"]) [part="text"] {
			font-size: var(--font-size-sm);
			line-height: var(--line-height-normal);
			color: var(--color-fg-muted);
		}
	`;

	static override properties = {
		as: { type: String },
		variant: { type: String, reflect: true },
	};

	declare as: TextTag;
	declare variant: TextVariant;

	constructor() {
		super();
		this.as = "p";
		this.variant = "body";
	}

	override render() {
		const id = this.id || nothing;
		switch (this.as) {
			case "h1":
				return html`<h1 part="text" id=${id}><slot></slot></h1>`;
			case "h2":
				return html`<h2 part="text" id=${id}><slot></slot></h2>`;
			case "h3":
				return html`<h3 part="text" id=${id}><slot></slot></h3>`;
			case "h4":
				return html`<h4 part="text" id=${id}><slot></slot></h4>`;
			case "span":
				return html`<span part="text" id=${id}><slot></slot></span>`;
			case "li":
				return html`<li part="text" id=${id}><slot></slot></li>`;
			default:
				return html`<p part="text" id=${id}><slot></slot></p>`;
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"ds-text": DsText;
	}
}
