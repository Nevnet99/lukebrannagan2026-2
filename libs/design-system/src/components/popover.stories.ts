import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta = {
	title: "Components/Popover",
	component: "ds-popover",
	tags: ["autodocs"],
	args: {
		placement: "top",
	},
	argTypes: {
		placement: {
			control: "select",
			options: ["top", "bottom", "start", "end"],
		},
	},
	parameters: {
		layout: "centered",
	},
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: ({ placement }) => html`
		<ds-popover placement=${placement}>
			<button slot="trigger" type="button">Hover me</button>
			<div slot="content">
				<strong>Popover title</strong>
				<p style="margin: 0.25rem 0 0">Short supporting detail.</p>
			</div>
		</ds-popover>
	`,
};

export const OnLink: Story = {
	render: ({ placement }) => html`
		<ds-popover placement=${placement}>
			<a slot="trigger" href="#review">Book spine</a>
			<div slot="content">
				<strong>Designing Data-Intensive Applications</strong>
				<p style="margin: 0.25rem 0 0">Martin Kleppmann</p>
				<p style="margin: 0.25rem 0 0">To be reviewed</p>
			</div>
		</ds-popover>
	`,
};
