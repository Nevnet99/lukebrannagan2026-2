import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import type { SpacingToken } from "../../types";

const meta = {
	title: "Components/Stack",
	component: "ds-stack",
	tags: ["autodocs"],
	argTypes: {
		gap: {
			control: "select",
			options: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"] satisfies SpacingToken[],
		},
	},
	args: { gap: "md" as SpacingToken },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: ({ gap }) => html`
		<ds-stack gap=${gap}>
			<ds-text variant="title">One</ds-text>
			<ds-text variant="body">Two</ds-text>
			<ds-text variant="muted">Three</ds-text>
		</ds-stack>
	`,
};
