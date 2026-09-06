import { getSeries, getWorkSeriesMembers } from "@lukebrannagan/content";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { renderSeriesStack } from "./storybook/series-stack";
import { renderStarRating, starRatingStyles } from "./storybook/star-rating";

const meta = {
	title: "Components",
	tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const SeriesStack: Story = {
	name: "Series stack",
	render: () => {
		const series = getSeries("kroo", "work");
		if (!series) {
			return html`<p>Missing Kroo series fixture</p>`;
		}
		const members = getWorkSeriesMembers(series);
		return html`
			<ds-container>
				<ul class="surface-list" style="max-inline-size: 42rem">
					${renderSeriesStack(series, members)}
				</ul>
			</ds-container>
		`;
	},
};

export const StarRating: Story = {
	name: "Star rating",
	render: () => html`
		<style>
			${starRatingStyles}
		</style>
		<ds-container>
			<ds-stack gap="lg">
				<div>
					<ds-text variant="meta">Default</ds-text>
					<div style="margin-top: var(--space-xs)">${renderStarRating(4)}</div>
				</div>
				<div>
					<ds-text variant="meta">Compact (spine)</ds-text>
					<div style="margin-top: var(--space-xs)">${renderStarRating(3, "sm")}</div>
				</div>
				<div>
					<ds-text variant="meta">Scale</ds-text>
					<div
						style="margin-top: var(--space-xs); display:flex; flex-direction:column; gap:var(--space-sm)"
					>
						${[1, 2, 3, 4, 5].map(
							(n) => html`
								<div style="display:flex; align-items:center; gap:var(--space-md)">
									${renderStarRating(n)}
									<ds-text variant="muted">${n} / 5</ds-text>
								</div>
							`,
						)}
					</div>
				</div>
			</ds-stack>
		</ds-container>
	`,
};
