/** Cookie banner styles mirrored from `CookieBanner.astro` (shown state). */
export const cookieBannerStyles = `
	.cookie-banner {
		position: relative;
		inset: auto;
		z-index: 40;
		box-sizing: border-box;
		inline-size: 100%;
		max-inline-size: 100vw;
		padding: var(--space-md);
		pointer-events: none;
	}
	.cookie-banner__inner {
		pointer-events: auto;
		box-sizing: border-box;
		max-inline-size: min(40rem, 100%);
		margin-inline: auto;
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--space-md);
		padding: var(--space-md) var(--space-lg);
		background: var(--color-bg);
		border: var(--rule) solid var(--color-border);
		box-shadow: var(--shadow-overlay);
	}
	@media (max-width: 40rem) {
		.cookie-banner {
			padding: var(--space-sm);
		}
		.cookie-banner__inner {
			gap: var(--space-sm);
			padding: var(--space-sm) var(--space-md);
		}
	}
	.cookie-banner__copy {
		flex: 1 1 14rem;
		min-inline-size: 0;
	}
	.cookie-banner__title {
		margin: 0 0 var(--space-2xs);
		font-family: var(--font-body);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-fg);
	}
	.cookie-banner__desc {
		margin: 0;
		font-family: var(--font-body);
		font-size: var(--font-size-sm);
		line-height: var(--line-height-snug);
		color: var(--color-fg-muted);
		max-width: none;
	}
	.cookie-banner__actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
	}
	.cookie-banner__btn {
		appearance: none;
		border: var(--rule) solid var(--color-border);
		border-radius: var(--radius-sm);
		padding: 0.55rem 0.9rem;
		font-family: var(--font-body);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		line-height: 1;
		min-block-size: var(--hit-min, 2.75rem);
		cursor: pointer;
		color: var(--color-fg);
		background: transparent;
	}
	.cookie-banner__btn--solid {
		background: var(--color-fg);
		border-color: var(--color-fg);
		color: var(--color-bg);
	}
`;
