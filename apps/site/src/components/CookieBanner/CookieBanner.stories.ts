import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { cookieBannerStyles } from "./cookie-banner.css";

const meta = {
	title: "Components/CookieBanner",
	tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
	name: "Cookie banner",
	render: () => html`
		<style>
			${cookieBannerStyles}
		</style>
		<div
			class="cookie-banner"
			role="dialog"
			aria-labelledby="cookie-banner-title"
			aria-describedby="cookie-banner-desc"
		>
			<div class="cookie-banner__inner">
				<div class="cookie-banner__copy">
					<p class="cookie-banner__title" id="cookie-banner-title">Analytics cookies</p>
					<p class="cookie-banner__desc" id="cookie-banner-desc">
						I use PostHog to see which pages get read. No ads. You can say no. See the
						<ds-link href="/cookies">cookie policy</ds-link>.
					</p>
				</div>
				<div class="cookie-banner__actions">
					<button type="button" class="cookie-banner__btn">Reject</button>
					<button type="button" class="cookie-banner__btn cookie-banner__btn--solid">
						Accept
					</button>
				</div>
			</div>
		</div>
	`,
};
