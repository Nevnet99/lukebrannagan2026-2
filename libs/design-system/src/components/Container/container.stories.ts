import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta = {
	title: "Components/Container",
	component: "ds-container",
	tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => html`
		<ds-container>
			<ds-stack gap="sm">
				<ds-text as="h2" variant="title">Page measure</ds-text>
				<ds-text variant="body">
					Containers cap width at --page-max and apply --page-gutter on both sides.
				</ds-text>
			</ds-stack>
		</ds-container>
	`,
};
