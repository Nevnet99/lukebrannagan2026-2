import { css, html, LitElement } from "lit";
import type { TextTag, TextVariant } from "../types";

export class DsText extends LitElement {
	static override styles = css`
		:host {
			display: block;
			max-width: var(--measure);
		}

		[part="text"] {
			margin: 0;
			overflow-wrap: break-word;
			scroll-margin-block-start: var(--space-xl);
		}

		:host([variant="display"]) [part="text"] {
			font-size: var(--text-display);
			font-weight: var(--font-weight-semibold);
			line-height: var(--line-height-tight);
			letter-spacing: var(--letter-spacing-tight);
			text-wrap: balance;
		}

		:host([variant="title"]) [part="text"] {
			font-size: var(--text-title);
			font-weight: var(--font-weight-semibold);
			line-height: var(--line-height-snug);
		}

		:host([variant="body"]) [part="text"] {
			font-size: var(--text-body);
			font-weight: var(--font-weight-regular);
			line-height: var(--line-height-normal);
			color: var(--color-fg);
			text-wrap: pretty;
		}

		:host([variant="meta"]) [part="text"] {
			font-family: var(--font-meta);
			font-size: var(--text-meta);
			font-weight: var(--font-weight-regular);
			line-height: var(--line-height-snug);
			letter-spacing: var(--letter-spacing-meta);
			color: var(--color-fg-muted);
			text-transform: uppercase;
		}

		:host([variant="muted"]) [part="text"] {
			font-size: var(--text-muted);
			font-weight: var(--font-weight-regular);
			line-height: var(--line-height-normal);
			color: var(--color-fg-muted);
			text-wrap: pretty;
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

	/**
	 * Keep `id` on the host so light-DOM `aria-labelledby` can resolve it.
	 * Do not mirror the same id into the shadow tree.
	 */
	override render() {
		switch (this.as) {
			case "h1":
				return html`<h1 part="text"><slot></slot></h1>`;
			case "h2":
				return html`<h2 part="text"><slot></slot></h2>`;
			case "h3":
				return html`<h3 part="text"><slot></slot></h3>`;
			case "h4":
				return html`<h4 part="text"><slot></slot></h4>`;
			case "span":
				return html`<span part="text"><slot></slot></span>`;
			case "li":
				return html`<li part="text"><slot></slot></li>`;
			default:
				return html`<p part="text"><slot></slot></p>`;
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"ds-text": DsText;
	}
}
