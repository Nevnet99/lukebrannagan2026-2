import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import type { BreadcrumbItem } from "./breadcrumb";

const meta = {
	title: "Components/Breadcrumb",
	component: "ds-breadcrumb",
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
} satisfies Meta;

export default meta;
type Story = StoryObj;

const workSeries: BreadcrumbItem[] = [
	{ label: "Selected work", href: "/work" },
	{ label: "Kroo", href: "/work/series/kroo" },
	{ label: "Kroo design system" },
];

export const WorkSeries: Story = {
	render: () => html`<ds-breadcrumb .items=${workSeries}></ds-breadcrumb>`,
};

export const WorkOnly: Story = {
	render: () =>
		html`<ds-breadcrumb
			.items=${[{ label: "Selected work", href: "/work" }, { label: "Primer observability" }]}
		></ds-breadcrumb>`,
};

export const Writing: Story = {
	render: () =>
		html`<ds-breadcrumb
			.items=${[
				{ label: "Writing", href: "/writing" },
				{ label: "Thinking in patterns, not features" },
			]}
		></ds-breadcrumb>`,
};
