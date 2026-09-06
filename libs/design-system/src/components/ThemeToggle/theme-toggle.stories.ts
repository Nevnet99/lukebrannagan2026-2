import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta = {
	title: "Components/ThemeToggle",
	component: "ds-theme-toggle",
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => html`<ds-theme-toggle></ds-theme-toggle>`,
};
