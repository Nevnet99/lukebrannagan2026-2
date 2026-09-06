import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta = {
	title: "Components/Link",
	component: "ds-link",
	tags: ["autodocs"],
	args: {
		href: "/work",
		label: "View all",
		external: false,
		current: "",
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Internal: Story = {
	render: ({ href, label }) => html`<ds-link href=${href}>${label}</ds-link>`,
};

export const External: Story = {
	args: {
		href: "https://github.com/Nevnet99",
		label: "GitHub",
		external: true,
	},
	render: ({ href, label, external }) => html`
		<ds-link href=${href} ?external=${external}>${label}</ds-link>
	`,
};

export const CurrentPage: Story = {
	args: {
		href: "/writing",
		label: "Writing",
		current: "page",
	},
	render: ({ href, label, current }) => html`
		<ds-link href=${href} current=${current || undefined}>${label}</ds-link>
	`,
};
