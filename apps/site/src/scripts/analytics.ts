import {
	type AnalyticsConsent,
	analytics,
	analyticsReady,
	readAnalyticsConsent,
	resetAnalyticsFacade,
	writeAnalyticsConsent,
} from "../lib/analytics";

async function startAnalyticsIfAllowed() {
	if (!analyticsReady()) return;
	await analytics().init();
}

function applyConsent(value: AnalyticsConsent) {
	writeAnalyticsConsent(value);
	if (value === "granted") {
		void startAnalyticsIfAllowed();
		return;
	}
	resetAnalyticsFacade();
}

function hideBanner(banner: HTMLElement) {
	banner.hidden = true;
	banner.setAttribute("aria-hidden", "true");
}

function showBanner(banner: HTMLElement) {
	banner.hidden = false;
	banner.removeAttribute("aria-hidden");
}

/**
 * Boot consent UI + analytics. PostHog never loads without an Accept.
 */
export function mountAnalytics() {
	const banner = document.querySelector<HTMLElement>("[data-cookie-banner]");
	const existing = readAnalyticsConsent();

	if (existing === "granted") {
		void startAnalyticsIfAllowed();
		if (banner) hideBanner(banner);
	} else if (existing === "denied") {
		if (banner) hideBanner(banner);
	} else if (banner) {
		showBanner(banner);
	}

	banner?.querySelectorAll<HTMLButtonElement>("[data-cookie-consent]").forEach((button) => {
		button.addEventListener("click", () => {
			const value = button.dataset.cookieConsent;
			if (value !== "granted" && value !== "denied") return;
			applyConsent(value);
			hideBanner(banner);
		});
	});

	document.querySelectorAll<HTMLButtonElement>("[data-cookie-preference]").forEach((button) => {
		button.addEventListener("click", () => {
			const value = button.dataset.cookiePreference;
			if (value !== "granted" && value !== "denied") return;
			applyConsent(value);
			const status = document.querySelector("[data-cookie-status]");
			if (status) {
				status.textContent =
					value === "granted" ? "Analytics cookies are on." : "Analytics cookies are off.";
			}
			if (banner) hideBanner(banner);
		});
	});
}

if (typeof document !== "undefined") {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => mountAnalytics(), {
			once: true,
		});
	} else {
		mountAnalytics();
	}
}
