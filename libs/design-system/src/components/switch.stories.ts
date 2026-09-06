import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta = {
	title: "Components/Switch",
	component: "ds-switch",
	tags: ["autodocs"],
	args: {
		label: "Archived",
		checked: false,
	},
	parameters: {
		layout: "centered",
	},
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: ({ label, checked }) => html`
		<ds-switch label=${label} ?checked=${checked}></ds-switch>
	`,
};

export const Checked: Story = {
	args: {
		label: "Theme",
		checked: true,
	},
	render: ({ label, checked }) => html`
		<ds-switch label=${label} icon="dark_mode" ?checked=${checked}></ds-switch>
	`,
};

export const WithIcon: Story = {
	args: {
		label: "Theme",
		checked: false,
	},
	render: ({ label, checked }) => html`
		<ds-switch
			label=${label}
			icon=${checked ? "dark_mode" : "light_mode"}
			?checked=${checked}
		></ds-switch>
	`,
};
