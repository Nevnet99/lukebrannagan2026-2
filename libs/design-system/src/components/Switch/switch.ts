import { css, html, LitElement, nothing } from "lit";
import { type IconName, isIconName } from "../../icons";

let switchId = 0;

/**
 * Labeled checkbox switch — same control used for writing “Archived” and theme.
 * Optional `icon` places a Material Symbol in the thumb (pip).
 */
export class DsSwitch extends LitElement {
	static override styles = css`
		:host {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-label);
			box-sizing: border-box;
		}

		:host([hide-label]) {
			gap: 0;
		}

		.label {
			font-family: var(--font-meta);
			font-size: var(--font-size-xs);
			letter-spacing: var(--letter-spacing-meta);
			color: var(--color-fg-subtle);
			margin: 0;
			padding: 0;
			cursor: pointer;
		}

		.toggle {
			position: relative;
			display: inline-flex;
			align-items: center;
			min-height: var(--hit-compact);
			cursor: pointer;
			box-sizing: border-box;
		}

		input {
			position: absolute;
			inline-size: 1px;
			block-size: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			white-space: nowrap;
			border: 0;
		}

		.track {
			display: inline-flex;
			align-items: center;
			flex-shrink: 0;
			box-sizing: border-box;
			inline-size: 1.75rem;
			block-size: 1rem;
			min-inline-size: 1.75rem;
			max-inline-size: 1.75rem;
			padding: 0.125rem;
			border-radius: 999px;
			background: var(--color-border-strong);
		}

		.thumb {
			display: grid;
			place-items: center;
			box-sizing: border-box;
			inline-size: 0.75rem;
			block-size: 0.75rem;
			min-inline-size: 0.75rem;
			min-block-size: 0.75rem;
			max-inline-size: 0.75rem;
			max-block-size: 0.75rem;
			border-radius: 999px;
			background: var(--color-bg);
			color: var(--color-fg-muted);
			translate: 0 0;
			overflow: hidden;
		}

		/* Fixed glyph slot — default ds-icon size must not expand the pip */
		.thumb ds-icon {
			--icon-size: 0.5rem;
			min-inline-size: 0;
			min-block-size: 0;
			max-inline-size: 100%;
			max-block-size: 100%;
		}

		/* Icon switches: larger locked pip so the glyph is readable */
		:host([icon]) .track {
			inline-size: 2.25rem;
			block-size: 1.25rem;
			min-inline-size: 2.25rem;
			max-inline-size: 2.25rem;
		}

		:host([icon]) .thumb {
			inline-size: 1rem;
			block-size: 1rem;
			min-inline-size: 1rem;
			min-block-size: 1rem;
			max-inline-size: 1rem;
			max-block-size: 1rem;
		}

		:host([icon]) .thumb ds-icon {
			--icon-size: 0.75rem;
		}

		.toggle:has(input:checked) .track {
			background: var(--color-accent);
		}

		.toggle:has(input:checked) .thumb {
			translate: 0.75rem 0;
			color: var(--color-accent);
		}

		:host([icon]) .toggle:has(input:checked) .thumb {
			translate: 1rem 0;
		}

		.toggle:has(input:focus-visible) {
			outline: var(--focus-ring) solid var(--color-focus);
			outline-offset: var(--focus-offset);
		}

		@media (prefers-reduced-motion: no-preference) {
			.track {
				transition-property: background-color;
				transition-duration: var(--duration-fast);
				transition-timing-function: var(--ease-out);
			}

			.thumb {
				transition-property: translate, color;
				transition-duration: var(--duration-fast);
				transition-timing-function: var(--ease-out);
			}
		}

		@media (forced-colors: active) {
			.toggle:has(input:focus-visible) {
				outline: var(--focus-ring) solid Highlight;
			}

			.track {
				forced-color-adjust: none;
				background: GrayText;
				border: 1px solid CanvasText;
			}

			.toggle:has(input:checked) .track {
				background: Highlight;
			}

			.thumb {
				background: Canvas;
				color: CanvasText;
			}
		}
	`;

	static override properties = {
		label: { type: String },
		name: { type: String },
		icon: { type: String, reflect: true },
		/** Keep `label` for the accessible name but hide the visible caption */
		hideLabel: { type: Boolean, attribute: "hide-label", reflect: true },
		checked: { type: Boolean, reflect: true },
		disabled: { type: Boolean, reflect: true },
	};

	declare label: string;
	declare name: string;
	declare icon: string;
	declare hideLabel: boolean;
	declare checked: boolean;
	declare disabled: boolean;

	#id = `ds-switch-${++switchId}`;

	constructor() {
		super();
		this.label = "";
		this.name = "";
		this.icon = "";
		this.hideLabel = false;
		this.checked = false;
		this.disabled = false;
	}

	#onChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		this.checked = input.checked;
		this.dispatchEvent(
			new Event("change", {
				bubbles: true,
				composed: true,
			}),
		);
	};

	override render() {
		const name = this.label.trim();
		const showCaption = name.length > 0 && !this.hideLabel;
		const iconName = isIconName(this.icon) ? (this.icon as IconName) : null;

		return html`
			${showCaption ? html`<label class="label" for=${this.#id}>${name}</label>` : nothing}
			<label class="toggle" for=${this.#id}>
				<input
					id=${this.#id}
					type="checkbox"
					name=${this.name || nothing}
					aria-label=${this.hideLabel && name ? name : nothing}
					.checked=${this.checked}
					?disabled=${this.disabled}
					@change=${this.#onChange}
				/>
				<span class="track" aria-hidden="true">
					<span class="thumb">
						${iconName ? html`<ds-icon name=${iconName}></ds-icon>` : nothing}
					</span>
				</span>
			</label>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"ds-switch": DsSwitch;
	}
}
