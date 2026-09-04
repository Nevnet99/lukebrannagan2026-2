import { css, html, LitElement } from "lit";

export class DsSkipLinks extends LitElement {
	static override styles = css`
		:host {
			position: absolute;
			inset-inline-start: var(--space-md);
			inset-block-start: var(--space-md);
			z-index: 100;
		}

		nav {
			display: flex;
			gap: var(--space-sm);
		}

		a {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			white-space: nowrap;
			border: 0;
			background: var(--color-fg);
			color: var(--color-bg);
			text-decoration: none;
			font-size: var(--font-size-sm);
		}

		a:focus {
			position: static;
			width: auto;
			height: auto;
			margin: 0;
			padding: var(--space-xs) var(--space-sm);
			overflow: visible;
			clip: auto;
			white-space: normal;
			outline: var(--focus-ring) solid var(--color-focus);
			outline-offset: var(--focus-offset);
		}
	`;

	override render() {
		return html`
			<nav part="nav" aria-label="Skip links">
				<a part="link" href="#main">Skip to content</a>
				<a part="link" href="#nav">Skip to navigation</a>
			</nav>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"ds-skip-links": DsSkipLinks;
	}
}
