import { css, html, LitElement } from "lit";

export type PopoverPlacement = "top" | "bottom" | "start" | "end";

const PLACEMENTS = new Set<PopoverPlacement>(["top", "bottom", "start", "end"]);

/**
 * Hover / focus popover — trigger in `trigger` slot, panel body in `content`.
 * Panel is non-interactive (pointer-events: none) so click-through to links works.
 * Positioned `fixed` so ancestors with overflow/transform don’t clip it.
 *
 * @example
 * ```html
 * <ds-popover placement="top">
 *   <a slot="trigger" href="/writing/ddia">DDIA</a>
 *   <div slot="content">
 *     <p>Designing Data-Intensive Applications</p>
 *     <p>Martin Kleppmann</p>
 *   </div>
 * </ds-popover>
 * ```
 */
export class DsPopover extends LitElement {
	static override styles = css`
		:host {
			display: inline-flex;
			vertical-align: bottom;
			max-width: 100%;
		}

		.trigger {
			display: inline-flex;
			max-width: 100%;
		}

		.panel {
			position: fixed;
			z-index: 1000;
			box-sizing: border-box;
			margin: 0;
			min-inline-size: 11rem;
			max-inline-size: min(18rem, calc(100vw - 2rem));
			padding: var(--space-sm) var(--space-md);
			border: none;
			border-radius: var(--radius-sm);
			background: var(--color-bg-surface);
			color: var(--color-fg);
			box-shadow: var(--shadow-overlay);
			pointer-events: none;
			opacity: 0;
			visibility: hidden;
			translate: 0 0.25rem;
		}

		:host([open]) .panel {
			opacity: 1;
			visibility: visible;
			translate: 0 0;
		}

		@media (prefers-reduced-motion: no-preference) {
			.panel {
				transition-property: opacity, visibility, translate;
				transition-duration: var(--duration-fast);
				transition-timing-function: var(--ease-out);
			}
		}

		@media (forced-colors: active) {
			.panel {
				forced-color-adjust: none;
				background: Canvas;
				color: CanvasText;
				outline: 1px solid CanvasText;
			}
		}
	`;

	static override properties = {
		open: { type: Boolean, reflect: true },
		placement: { type: String, reflect: true },
	};

	declare open: boolean;
	declare placement: PopoverPlacement;

	#panel: HTMLElement | null = null;
	#hideTimer = 0;
	#ro: ResizeObserver | null = null;

	constructor() {
		super();
		this.open = false;
		this.placement = "top";
	}

	override connectedCallback() {
		super.connectedCallback();
		this.addEventListener("mouseenter", this.#onEnter);
		this.addEventListener("mouseleave", this.#onLeave);
		this.addEventListener("focusin", this.#onEnter);
		this.addEventListener("focusout", this.#onFocusOut);
		window.addEventListener("scroll", this.#onReposition, true);
		window.addEventListener("resize", this.#onReposition);
	}

	override disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener("mouseenter", this.#onEnter);
		this.removeEventListener("mouseleave", this.#onLeave);
		this.removeEventListener("focusin", this.#onEnter);
		this.removeEventListener("focusout", this.#onFocusOut);
		window.removeEventListener("scroll", this.#onReposition, true);
		window.removeEventListener("resize", this.#onReposition);
		this.#ro?.disconnect();
		this.#ro = null;
		window.clearTimeout(this.#hideTimer);
	}

	override firstUpdated() {
		this.#panel = this.renderRoot.querySelector(".panel");
		this.#ro = new ResizeObserver(() => {
			if (this.open) this.#position();
		});
		this.#ro.observe(this);
	}

	override updated(changed: Map<string, unknown>) {
		if (changed.has("open") || changed.has("placement")) {
			if (this.open) this.#position();
		}
	}

	#resolvedPlacement(): PopoverPlacement {
		return PLACEMENTS.has(this.placement) ? this.placement : "top";
	}

	#onEnter = () => {
		window.clearTimeout(this.#hideTimer);
		this.open = true;
		requestAnimationFrame(() => {
			this.#position();
			requestAnimationFrame(() => this.#position());
		});
	};

	#onLeave = () => {
		this.#scheduleHide();
	};

	#onFocusOut = (event: FocusEvent) => {
		const next = event.relatedTarget;
		if (next instanceof Node && this.contains(next)) return;
		this.#scheduleHide();
	};

	#scheduleHide() {
		window.clearTimeout(this.#hideTimer);
		this.#hideTimer = window.setTimeout(() => {
			this.open = false;
		}, 80);
	}

	#onReposition = () => {
		if (this.open) this.#position();
	};

	#position() {
		const panel = this.#panel;
		if (!panel) return;

		const gap = 8;
		const triggerEl = this.#assignedTrigger() ?? this;
		const trigger = triggerEl.getBoundingClientRect();
		const placement = this.#resolvedPlacement();

		/* Measure after making layout available */
		panel.style.left = "0px";
		panel.style.top = "0px";
		const panelRect = panel.getBoundingClientRect();
		const pw = panelRect.width || 176;
		const ph = panelRect.height || 80;

		let left = trigger.left + trigger.width / 2 - pw / 2;
		let top = trigger.top - ph - gap;

		if (placement === "bottom") {
			top = trigger.bottom + gap;
		} else if (placement === "start") {
			left = trigger.left - pw - gap;
			top = trigger.top + trigger.height / 2 - ph / 2;
		} else if (placement === "end") {
			left = trigger.right + gap;
			top = trigger.top + trigger.height / 2 - ph / 2;
		}

		const pad = 8;
		left = Math.min(Math.max(pad, left), window.innerWidth - pw - pad);
		top = Math.min(Math.max(pad, top), window.innerHeight - ph - pad);

		panel.style.left = `${Math.round(left)}px`;
		panel.style.top = `${Math.round(top)}px`;
	}

	#assignedTrigger(): Element | null {
		const slot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="trigger"]');
		return slot?.assignedElements({ flatten: true })[0] ?? null;
	}

	override render() {
		return html`
			<div class="trigger" part="trigger">
				<slot name="trigger"></slot>
			</div>
			<div class="panel" part="panel" role="tooltip" aria-hidden="true">
				<slot name="content"></slot>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"ds-popover": DsPopover;
	}
}
