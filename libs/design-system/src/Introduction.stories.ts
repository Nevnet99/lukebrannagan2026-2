import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta = {
	title: "Introduction",
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Welcome: Story = {
	render: () => html`
		<ds-container>
			<ds-stack gap="md">
				<ds-text as="h1" variant="display">Design system</ds-text>
				<ds-text variant="muted">
					Lit primitives and tokens for lukebrannagan.com. Foundations cover color, type,
					and spacing; Components are the interactive set. Use the theme toolbar for light
					and dark.
				</ds-text>
				<ds-rule></ds-rule>
				<p>
					<ds-link href="https://lukebrannagan.com" external>
						Open live site
					</ds-link>
				</p>
			</ds-stack>
		</ds-container>
	`,
};
