import { css, html, LitElement } from "lit";

/**
 * First focusable control on the page. Targets must be focusable
 * (`tabindex="-1"` on `#main` / `#nav`) so skip moves keyboard focus.
 */
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
			flex-wrap: wrap;
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
			font-weight: var(--font-weight-medium);
		}

		/* Skip links must reveal on :focus (not only :focus-visible) */
		a:focus {
			position: static;
			width: auto;
			height: auto;
			min-height: var(--hit-min);
			display: inline-flex;
			align-items: center;
			margin: 0;
			padding: var(--space-xs) var(--space-sm);
			overflow: visible;
			clip: auto;
			white-space: normal;
			outline: var(--focus-ring) solid var(--color-bg);
			outline-offset: var(--focus-offset);
		}

		@media (forced-colors: active) {
			a:focus {
				outline: var(--focus-ring) solid Highlight;
				forced-color-adjust: none;
				background: CanvasText;
				color: Canvas;
			}
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
