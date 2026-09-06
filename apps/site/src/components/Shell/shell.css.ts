/** Shell chrome styles mirrored from `layouts/PageLayout.astro`. */
export const shellStyles = `
	.shell {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}
	.shell__header {
		padding-block: var(--space-lg) var(--space-md);
		box-shadow: var(--shadow-border);
		background: color-mix(in oklch, var(--color-bg) 94%, transparent);
	}
	.shell__bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-md);
		min-height: var(--hit-min);
	}
	.shell__brand::part(anchor) {
		font-weight: var(--font-weight-semibold);
		color: var(--color-fg);
		text-decoration: none;
	}
	.shell__nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-md);
	}
	.shell__nav ds-link::part(anchor) {
		text-decoration: none;
		color: var(--color-fg-muted);
		font-weight: var(--font-weight-medium);
	}
	.shell__nav ds-link[current="page"]::part(anchor) {
		color: var(--color-fg);
	}
	.shell__nav ds-theme-toggle {
		margin-inline-start: var(--space-xs);
	}
	.shell__main {
		flex: 1;
		padding-block-start: var(--space-2xl);
		padding-block-end: var(--space-4xl);
	}
	.shell__footer {
		padding-block: var(--space-2xl);
	}
	.shell__social {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-md);
	}
	.shell__social ds-link::part(anchor) {
		font-size: var(--font-size-sm);
		color: var(--color-fg-muted);
		text-decoration: none;
	}
	.shell__copyright {
		margin: var(--space-md) 0 0;
		font-family: var(--font-meta);
		font-size: var(--font-size-xs);
		letter-spacing: var(--letter-spacing-meta);
		line-height: var(--line-height-snug);
		color: var(--color-fg-subtle);
	}
`;
