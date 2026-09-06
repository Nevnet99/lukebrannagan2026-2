import { hasAnalyticsConsent } from "./consent";
import { createNoopAnalytics } from "./noop";
import { createPostHogAnalytics } from "./posthog";
import type { Analytics } from "./types";

export {
	type AnalyticsConsent,
	hasAnalyticsConsent,
	readAnalyticsConsent,
	writeAnalyticsConsent,
} from "./consent";
export type { Analytics, AnalyticsProperties } from "./types";

let instance: Analytics | null = null;

function readConfig() {
	const apiKey =
		typeof import.meta.env.PUBLIC_POSTHOG_KEY === "string"
			? import.meta.env.PUBLIC_POSTHOG_KEY.trim()
			: "";
	const apiHost =
		(typeof import.meta.env.PUBLIC_POSTHOG_HOST === "string"
			? import.meta.env.PUBLIC_POSTHOG_HOST.trim()
			: "") || "https://eu.i.posthog.com";

	return { apiKey, apiHost };
}

function createConfiguredAnalytics(): Analytics {
	const { apiKey, apiHost } = readConfig();
	if (!apiKey) return createNoopAnalytics();
	return createPostHogAnalytics({ apiKey, apiHost });
}

/**
 * Analytics facade — PostHog only when configured and consent is granted.
 * Site code should only import from this module.
 */
export function analytics(): Analytics {
	if (instance) return instance;
	instance = createConfiguredAnalytics();
	return instance;
}

/** Drop the live client after consent is withdrawn. */
export function resetAnalyticsFacade() {
	instance?.reset();
	instance = createConfiguredAnalytics();
}

export function analyticsReady(): boolean {
	const { apiKey } = readConfig();
	return Boolean(apiKey) && hasAnalyticsConsent();
}
