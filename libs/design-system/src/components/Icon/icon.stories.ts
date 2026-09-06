import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { type IconName, iconNames } from "../../icons";

const meta = {
	title: "Components/Icon",
	component: "ds-icon",
	tags: ["autodocs"],
	argTypes: {
		name: { control: "select", options: iconNames },
	},
	args: {
		name: "dark_mode" as IconName,
		label: "",
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: ({ name, label }) => html`
		<ds-icon name=${name} label=${label || undefined}></ds-icon>
	`,
};

export const All: Story = {
	render: () => html`
		<ds-stack gap="md">
			${iconNames.map(
				(name) => html`
					<div style="display:flex;align-items:center;gap:0.75rem">
						<ds-icon name=${name} label=${name}></ds-icon>
						<ds-text variant="meta">${name}</ds-text>
					</div>
				`,
			)}
		</ds-stack>
	`,
};
