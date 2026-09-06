import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta = {
	title: "Foundations/Motion",
	tags: ["autodocs"],
	parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const curves = [
	["--ease-out", "Interactive"],
	["--ease-emphasized", "Lift / settle"],
	["--ease-enter", "Page enter"],
	["--ease-exit", "Exit"],
] as const;

const durations = [
	["--duration-instant", "Instant"],
	["--duration-fast", "Fast"],
	["--duration-moderate", "Moderate / lift"],
	["--duration-enter", "Enter"],
	["--duration-exit", "Exit"],
	["--stagger", "Stagger"],
] as const;

export const Curves: Story = {
	render: () => html`
		<style>
			.motion-demo {
				display: grid;
				gap: var(--space-lg);
			}
			.motion-row {
				display: grid;
				grid-template-columns: 9rem 1fr;
				gap: var(--space-md);
				align-items: center;
			}
			.motion-track {
				position: relative;
				height: 2.5rem;
				border-radius: var(--radius-sm);
				background: var(--color-bg-subtle);
				overflow: hidden;
			}
			.motion-dot {
				position: absolute;
				inset-block: 0.5rem;
				inset-inline-start: 0.5rem;
				inline-size: 1.5rem;
				border-radius: var(--radius-sm);
				background: var(--color-accent);
			}
			@media (prefers-reduced-motion: no-preference) {
				.motion-track:hover .motion-dot {
					animation: motion-slide 1.1s var(--demo-ease) both;
				}
			}
			@keyframes motion-slide {
				from {
					translate: 0 0;
				}
				to {
					translate: calc(100% + 12rem) 0;
				}
			}
		</style>
		<ds-stack gap="md">
			<ds-text variant="muted">Hover a track to replay the curve.</ds-text>
			<div class="motion-demo">
				${curves.map(
					([token, label]) => html`
						<div class="motion-row">
							<code
								style="font-family:var(--font-meta);font-size:var(--font-size-xs)"
								>${token}</code
							>
							<div class="motion-track" style=${`--demo-ease: var(${token})`} title=${label}>
								<span class="motion-dot"></span>
							</div>
						</div>
					`,
				)}
			</div>
		</ds-stack>
	`,
};

export const Durations: Story = {
	render: () => html`
		<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:var(--space-sm)">
			${durations.map(
				([token, label]) => html`
					<li style="display:flex;gap:var(--space-md);align-items:baseline">
						<code
							style="font-family:var(--font-meta);font-size:var(--font-size-xs);inline-size:11rem"
							>${token}</code
						>
						<span style="font-family:var(--font-meta);font-size:var(--font-size-xs);color:var(--color-fg-subtle)"
							>${label}</span
						>
					</li>
				`,
			)}
		</ul>
	`,
};

export const Enter: Story = {
	name: "Enter recipe",
	render: () => html`
		<style>
			.enter-demo > * {
				opacity: 0;
			}
			@media (prefers-reduced-motion: no-preference) {
				.enter-demo > * {
					animation: ds-enter var(--duration-enter) var(--ease-enter) both;
				}
				.enter-demo > *:nth-child(1) {
					animation-delay: 0ms;
				}
				.enter-demo > *:nth-child(2) {
					animation-delay: var(--stagger);
				}
				.enter-demo > *:nth-child(3) {
					animation-delay: calc(var(--stagger) * 2);
				}
			}
		</style>
		<ds-stack class="enter-demo" gap="md">
			<ds-text as="h2" variant="title">Staged enter</ds-text>
			<ds-text variant="body">Uses ds-enter with --ease-enter and --stagger.</ds-text>
			<p>
				<ds-link href="#">Example action</ds-link>
			</p>
		</ds-stack>
	`,
};
