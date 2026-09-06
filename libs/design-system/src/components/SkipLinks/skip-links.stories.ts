import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta = {
	title: "Components/SkipLinks",
	component: "ds-skip-links",
	tags: ["autodocs"],
	parameters: {
		docs: {
			description: {
				story: "Tab into the canvas to reveal the skip links.",
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => html`
		<ds-skip-links></ds-skip-links>
		<nav id="nav" tabindex="-1">
			<ds-text variant="meta">Navigation target</ds-text>
		</nav>
		<main id="main" tabindex="-1">
			<ds-text variant="body">Main content target</ds-text>
		</main>
	`,
};
