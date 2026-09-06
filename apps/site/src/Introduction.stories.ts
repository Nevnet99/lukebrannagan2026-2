import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta = {
	title: "Introduction",
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Welcome: Story = {
	render: () => html`
		<ds-container>
			<ds-stack gap="md">
				<ds-text as="h1" variant="display">Site</ds-text>
				<ds-text variant="muted">
					Page compositions for lukebrannagan.com — shell chrome, home sections, series
					stacks, and site-only UI. Lit primitives live in the design-system Storybook
					(:6006).
				</ds-text>
			</ds-stack>
		</ds-container>
	`,
};
