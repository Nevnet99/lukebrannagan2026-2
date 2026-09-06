import { css, html, LitElement } from "lit";
import type { SpacingToken } from "../../types";

export class DsStack extends LitElement {
	static override styles = css`
		:host {
			display: flex;
			flex-direction: column;
		}

		:host([gap="xs"]) {
			gap: var(--space-xs);
		}
		:host([gap="sm"]) {
			gap: var(--space-sm);
		}
		:host([gap="md"]) {
			gap: var(--space-md);
		}
		:host([gap="lg"]) {
			gap: var(--space-lg);
		}
		:host([gap="xl"]) {
			gap: var(--space-xl);
		}
		:host([gap="2xl"]) {
			gap: var(--space-2xl);
		}
		:host([gap="3xl"]) {
			gap: var(--space-3xl);
		}
	`;

	static override properties = {
		gap: { type: String, reflect: true },
	};

	declare gap: SpacingToken;

	constructor() {
		super();
		this.gap = "md";
	}

	override render() {
		return html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"ds-stack": DsStack;
	}
}
