import { getSeries, getWorkSeriesMembers } from "@lukebrannagan/content";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { renderSeriesStack } from "./series-stack";

const meta = {
	title: "Components/SeriesStack",
	tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
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
