import { css, html, LitElement, nothing } from "lit";
import { type IconName, iconGlyph, isIconName } from "../../icons";

/**
 * Material Symbols glyph. Decorative by default; pass `label` for a named icon.
 *
 * @example
 * ```html
 * <ds-icon name="dark_mode"></ds-icon>
 * <ds-icon name="light_mode" label="Light mode"></ds-icon>
 * ```
 */
export class DsIcon extends LitElement {
	static override styles = css`
		:host {
			display: inline-flex;
			inline-size: var(--icon-size, 1.25rem);
			block-size: var(--icon-size, 1.25rem);
			flex-shrink: 0;
			color: inherit;
			line-height: 0;
			vertical-align: middle;
		}

		svg {
			display: block;
			inline-size: 100%;
			block-size: 100%;
			fill: currentColor;
		}
	`;

	static override properties = {
		name: { type: String },
		label: { type: String },
	};

	declare name: IconName | "";
	declare label: string;

	constructor() {
		super();
		this.name = "";
		this.label = "";
	}

	override render() {
		if (!this.name || !isIconName(this.name)) {
			return nothing;
		}

		const labelled = this.label.trim().length > 0;

		return html`
			<svg
				part="svg"
				viewBox="0 -960 960 960"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden=${labelled ? nothing : "true"}
				role=${labelled ? "img" : nothing}
				aria-label=${labelled ? this.label : nothing}
			>
				${iconGlyph(this.name)}
			</svg>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"ds-icon": DsIcon;
	}
}
