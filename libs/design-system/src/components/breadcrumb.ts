import { css, html, LitElement, nothing } from "lit";

export type BreadcrumbItem = {
	label: string;
	/** Omit on the current page (last crumb). */
	href?: string;
};

function parseItems(value: string | null): BreadcrumbItem[] {
	if (!value?.trim()) return [];
	try {
		const parsed: unknown = JSON.parse(value);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter(
			(item): item is BreadcrumbItem =>
				item != null &&
				typeof item === "object" &&
				typeof (item as BreadcrumbItem).label === "string" &&
				((item as BreadcrumbItem).href == null ||
					typeof (item as BreadcrumbItem).href === "string"),
		);
	} catch {
		return [];
	}
}

/**
 * Hierarchical trail for nested pages (work → series → case study, etc.).
 * WAI-ARIA breadcrumb: labeled nav, ordered list, current page is not a link.
 *
 * @example
 * ```html
 * <ds-breadcrumb
 *   items='[{"label":"Selected work","href":"/work"},{"label":"Kroo","href":"/work/series/kroo"},{"label":"CMS"}]'
 * ></ds-breadcrumb>
 * ```
 */
export class DsBreadcrumb extends LitElement {
	static override styles = css`
		:host {
			display: block;
			max-width: 100%;
		}

		nav {
			min-width: 0;
		}

		ol {
			list-style: none;
			margin: 0;
			padding: 0;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			column-gap: var(--space-xs);
			row-gap: var(--space-2xs);
		}

		li {
			display: inline-flex;
			align-items: center;
			gap: var(--space-xs);
			min-width: 0;
			max-width: 100%;
		}

		a,
		[aria-current="page"] {
			font-family: var(--font-meta);
			font-size: var(--font-size-xs);
			letter-spacing: var(--letter-spacing-meta);
			line-height: var(--line-height-snug);
			min-height: var(--hit-compact);
			display: inline-flex;
			align-items: center;
			max-width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		a {
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

		a:focus-visible {
			outline: var(--focus-ring) solid var(--color-focus);
			outline-offset: var(--focus-offset);
		}

		[aria-current="page"] {
			color: var(--color-fg-muted);
			font-weight: var(--font-weight-medium);
		}

		.sep {
			flex-shrink: 0;
			color: var(--color-fg-subtle);
			font-family: var(--font-meta);
			font-size: var(--font-size-xs);
			line-height: 1;
			user-select: none;
		}

		@media (forced-colors: active) {
			a:focus-visible {
				outline: var(--focus-ring) solid Highlight;
			}

			.sep {
				color: GrayText;
			}
		}
	`;

	static override properties = {
		label: { type: String },
		items: {
			type: Array,
			attribute: "items",
			converter: {
				fromAttribute: (value: string | null) => parseItems(value),
				toAttribute: (value: BreadcrumbItem[]) => (value?.length ? JSON.stringify(value) : null),
			},
		},
	};

	declare label: string;
	declare items: BreadcrumbItem[];

	constructor() {
		super();
		this.label = "Breadcrumb";
		this.items = [];
	}

	override render() {
		const crumbs = this.items.filter((item) => item.label.trim().length > 0);
		if (crumbs.length === 0) return nothing;

		return html`
			<nav part="nav" aria-label=${this.label}>
				<ol part="list">
					${crumbs.map((item, index) => {
						const isCurrent = index === crumbs.length - 1;
						const showSep = !isCurrent;

						return html`
							<li part="item">
								${
									isCurrent
										? html`<span part="current" aria-current="page"
												>${item.label}</span
											>`
										: html`<a part="link" href=${item.href!}>${item.label}</a>`
								}
								${showSep ? html`<span class="sep" aria-hidden="true">/</span>` : nothing}
							</li>
						`;
					})}
				</ol>
			</nav>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"ds-breadcrumb": DsBreadcrumb;
	}
}
