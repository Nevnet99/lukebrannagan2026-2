import { html, type TemplateResult } from "lit";

/** Star rating markup mirrored from `StarRating.astro`. */
export function renderStarRating(rating: number, size: "sm" | "md" = "md"): TemplateResult {
	const clamped = Math.min(5, Math.max(1, Math.round(rating)));
	const label = `Rated ${clamped} out of 5`;
	const sizeClass = size === "sm" ? " star-rating--sm" : "";

	return html`
		<span class="star-rating${sizeClass}" role="img" aria-label=${label}>
			${[1, 2, 3, 4, 5].map(
				(n) => html`
					<span
						class="star-rating__star${n <= clamped ? " is-filled" : ""}"
						aria-hidden="true"
					>
						<ds-icon name="star"></ds-icon>
					</span>
				`,
			)}
		</span>
	`;
}

export const starRatingStyles = `
	.star-rating {
		display: inline-flex;
		align-items: center;
		gap: 0.1rem;
		color: var(--color-border);
	}
	.star-rating__star {
		display: inline-flex;
		line-height: 0;
	}
	.star-rating__star ds-icon {
		--icon-size: 1rem;
	}
	.star-rating--sm .star-rating__star ds-icon {
		--icon-size: 0.7rem;
	}
	.star-rating__star.is-filled {
		color: var(--color-accent);
	}
`;
