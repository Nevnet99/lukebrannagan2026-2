import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import type { TextTag, TextVariant } from "./types";

const meta = {
	title: "Components/Text",
	component: "ds-text",
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["display", "title", "body", "meta", "muted"] satisfies TextVariant[],
		},
		as: {
			control: "select",
			options: ["p", "h1", "h2", "h3", "h4", "span", "li"] satisfies TextTag[],
		},
	},
	args: {
		variant: "body" as TextVariant,
		as: "p" as TextTag,
		content: "Design systems, performance, and accessible interfaces.",
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: ({ variant, as, content }) => html`
		<ds-text variant=${variant} as=${as}>${content}</ds-text>
	`,
};

export const Scale: Story = {
	render: () => html`
		<ds-stack gap="md">
			<ds-text as="h1" variant="display">Display</ds-text>
			<ds-text as="h2" variant="title">Title</ds-text>
			<ds-text variant="body">Body — primary reading measure.</ds-text>
			<ds-text variant="muted">Muted — supporting detail.</ds-text>
			<ds-text variant="meta">Meta — labels and captions</ds-text>
		</ds-stack>
	`,
};
