import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta = {
	title: "Components/Rule",
	component: "ds-rule",
	tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => html`
		<ds-stack gap="md">
			<ds-text variant="body">Above the rule</ds-text>
			<ds-rule></ds-rule>
			<ds-text variant="muted">Below the rule</ds-text>
		</ds-stack>
	`,
};
