import { site } from "@lukebrannagan/content";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { shellStyles } from "./shell.css";

const meta = {
	title: "Shell/Chrome",
	tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Header: Story = {
	render: () => html`
		<style>
			${shellStyles}
		</style>
		<header class="shell__header">
			<ds-container>
				<div class="shell__bar">
					<ds-link class="shell__brand" href="/" current="page">${site.name}</ds-link>
					<nav id="nav" class="shell__nav" aria-label="Primary">
						${site.nav.map((item) => html`<ds-link href=${item.href}>${item.label}</ds-link>`)}
						<ds-theme-toggle></ds-theme-toggle>
					</nav>
				</div>
			</ds-container>
		</header>
	`,
};

export const Footer: Story = {
	render: () => html`
		<style>
			${shellStyles}
		</style>
		<footer class="shell__footer">
			<ds-container>
				<ul class="shell__social">
					${[...site.social, ...site.footerLegal].map(
						(item) => html`
							<li>
								<ds-link href=${item.href} ?external=${item.href.startsWith("http")}>
									${item.label}
								</ds-link>
							</li>
						`,
					)}
				</ul>
				<p class="shell__copyright">© ${new Date().getFullYear()} ${site.name}</p>
			</ds-container>
		</footer>
	`,
};

export const FullShell: Story = {
	name: "Full shell",
	render: () => html`
		<style>
			${shellStyles}
		</style>
		<div class="shell">
			<header class="shell__header">
				<ds-container>
					<div class="shell__bar">
						<ds-link class="shell__brand" href="/" current="page">${site.name}</ds-link>
						<nav class="shell__nav" aria-label="Primary">
							${site.nav.map((item) => html`<ds-link href=${item.href}>${item.label}</ds-link>`)}
							<ds-theme-toggle></ds-theme-toggle>
						</nav>
					</div>
				</ds-container>
			</header>
			<main class="shell__main">
				<ds-container>
					<ds-stack gap="md">
						<ds-text as="h1" variant="display">${site.name}</ds-text>
						<ds-text variant="muted">${site.role} · ${site.location}</ds-text>
						<ds-text variant="body">${site.tagline}</ds-text>
					</ds-stack>
				</ds-container>
			</main>
			<footer class="shell__footer">
				<ds-container>
					<ul class="shell__social">
						${[...site.social, ...site.footerLegal].map(
							(item) => html`
								<li>
									<ds-link
										href=${item.href}
										?external=${item.href.startsWith("http")}
									>
										${item.label}
									</ds-link>
								</li>
							`,
						)}
					</ul>
					<p class="shell__copyright">© ${new Date().getFullYear()} ${site.name}</p>
				</ds-container>
			</footer>
		</div>
	`,
};
