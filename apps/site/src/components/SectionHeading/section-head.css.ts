/** Shared section-head styles mirrored from `pages/index.astro`. */
export const sectionHeadStyles = `
	.section-head {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-md);
	}
	.section-head ds-text {
		flex: 1 1 auto;
		min-width: 0;
		max-width: none;
	}
	.section-head__link {
		flex: 0 0 auto;
		min-height: 0;
		align-self: baseline;
	}
	.section-head__link::part(anchor) {
		font-family: var(--font-meta);
		font-size: var(--font-size-xs);
		letter-spacing: var(--letter-spacing-meta);
		text-decoration: none;
		color: var(--color-fg-subtle);
		min-height: 0;
	}
	@media (hover: hover) {
		.section-head__link:hover::part(anchor) {
			color: var(--color-accent-text);
			text-decoration: underline;
			text-decoration-thickness: from-font;
			text-underline-position: from-font;
			text-underline-offset: 0.12em;
		}
	}
`;
