import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta = {
	title: "Foundations/Color",
	tags: ["autodocs"],
	parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const semantic = [
	["--color-bg", "Background"],
	["--color-bg-subtle", "Subtle"],
	["--color-bg-surface", "Surface"],
	["--color-fg", "Foreground"],
	["--color-fg-muted", "Muted"],
	["--color-fg-subtle", "Subtle text"],
	["--color-border", "Border"],
	["--color-accent", "Accent"],
	["--color-accent-text", "Accent text"],
	["--color-accent-subtle", "Accent subtle"],
	["--color-focus", "Focus"],
] as const;

export const Semantic: Story = {
	render: () => html`
		<div
			style="display:grid;grid-template-columns:repeat(auto-fill,minmax(9rem,1fr));gap:var(--space-md)"
		>
			${semantic.map(
				([token, label]) => html`
					<div>
						<div
							style="aspect-ratio:1.4;border-radius:var(--radius-md);background:var(${token});box-shadow:var(--shadow-border)"
						></div>
						<p
							style="margin:var(--space-xs) 0 0;font-family:var(--font-meta);font-size:var(--font-size-xs);letter-spacing:var(--letter-spacing-meta)"
						>
							${label}
						</p>
						<p
							style="margin:0;font-family:var(--font-meta);font-size:var(--font-size-xs);color:var(--color-fg-subtle)"
						>
							${token}
						</p>
					</div>
				`,
			)}
		</div>
	`,
};
