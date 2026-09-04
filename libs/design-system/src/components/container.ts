import { css, html, LitElement } from "lit";

export class DsContainer extends LitElement {
	static override styles = css`
		:host {
			display: block;
			width: min(100% - (var(--page-gutter) * 2), var(--page-max));
			margin-inline: auto;
		}
	`;

	override render() {
		return html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"ds-container": DsContainer;
	}
}
