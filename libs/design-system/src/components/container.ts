import { css, html, LitElement } from "lit";

export class DsContainer extends LitElement {
	static override styles = css`
		:host {
			display: block;
			box-sizing: border-box;
			width: min(100%, var(--page-max));
			padding-inline: var(--page-gutter);
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
