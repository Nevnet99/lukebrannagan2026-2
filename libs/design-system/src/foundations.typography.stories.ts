import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta = {
	title: "Foundations/Typography",
	tags: ["autodocs"],
	parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Scale: Story = {
	render: () => html`
		<ds-stack gap="lg">
			<ds-text as="h1" variant="display">Display — Geist Variable</ds-text>
			<ds-text as="h2" variant="title">Title — section headings</ds-text>
			<ds-text variant="body">
				Body — I build design systems and high-performance frontends. At Kroo I work on the
				public website: architecture, core repos, and accessibility.
			</ds-text>
			<ds-text variant="muted">Muted — supporting copy and list summaries.</ds-text>
			<ds-text variant="meta">Meta — labels, dates, stack lists</ds-text>
		</ds-stack>
	`,
};

export const Spacing: Story = {
	name: "Spacing scale",
	render: () => {
		const steps = ["3xs", "2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const;
		return html`
			<div style="display:flex;flex-direction:column;gap:var(--space-sm)">
				${steps.map(
					(step) => html`
						<div style="display:flex;align-items:center;gap:var(--space-md)">
							<code
								style="font-family:var(--font-meta);font-size:var(--font-size-xs);inline-size:4.5rem"
								>--space-${step}</code
							>
							<div
								style="block-size:var(--space-md);inline-size:var(--space-${step});background:var(--color-accent);border-radius:var(--radius-sm)"
							></div>
						</div>
					`,
				)}
			</div>
		`;
	},
};
