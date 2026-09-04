import { css, html, LitElement } from "lit";

export class DsRule extends LitElement {
	static override styles = css`
		:host {
			display: block;
		}

		hr {
			border: 0;
			border-top: var(--rule) solid var(--color-border);
			margin: 0;
			width: 100%;
		}
	`;

	override render() {
		return html`<hr part="rule" />`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"ds-rule": DsRule;
	}
}
