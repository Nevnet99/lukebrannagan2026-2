import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta = {
	title: "Foundations/Elevation",
	tags: ["autodocs"],
	parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const levels = [
	["--shadow-border", "Border"],
	["--shadow-sm", "Small"],
	["--shadow-md", "Medium"],
	["--shadow-lg", "Large"],
	["--shadow-surface", "Surface"],
	["--shadow-surface-hover", "Surface hover"],
	["--shadow-raised", "Raised"],
	["--shadow-overlay", "Overlay"],
] as const;

export const Scale: Story = {
	render: () => html`
		<div
			style="display:grid;grid-template-columns:repeat(auto-fill,minmax(10rem,1fr));gap:var(--space-xl);padding:var(--space-lg)"
		>
			${levels.map(
				([token, label]) => html`
					<div>
						<div
							style="
								aspect-ratio: 1.2;
								border-radius: var(--radius-md);
								background: var(--color-bg-surface);
								box-shadow: var(${token});
							"
						></div>
						<p
							style="margin:var(--space-sm) 0 0;font-family:var(--font-meta);font-size:var(--font-size-xs);letter-spacing:var(--letter-spacing-meta)"
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
