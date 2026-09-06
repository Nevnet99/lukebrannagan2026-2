import type { PostHog } from "posthog-js";
import type { Analytics, AnalyticsProperties } from "./types";

type PostHogConfig = {
	apiKey: string;
	apiHost: string;
};

/**
 * PostHog behind the Analytics facade.
 * Dynamically imports posthog-js so the SDK stays out of the critical path
 * and is omitted from the initial bundle when analytics never inits.
 */
export function createPostHogAnalytics(config: PostHogConfig): Analytics {
	let client: PostHog | null = null;
	let initPromise: Promise<void> | null = null;

	const ensure = () => client;

	return {
		enabled: true,
		async init() {
			if (client) return;
			if (initPromise) return initPromise;

			initPromise = (async () => {
				const { default: posthog } = await import("posthog-js");
				posthog.init(config.apiKey, {
					api_host: config.apiHost,
					defaults: "2026-05-30",
					capture_pageview: true,
					capture_pageleave: true,
					persistence: "localStorage+cookie",
				});
				client = posthog;
			})();

			try {
				await initPromise;
			} catch {
				client = null;
				initPromise = null;
			}
		},
		capture(event, properties?: AnalyticsProperties) {
			ensure()?.capture(event, properties);
		},
		identify(distinctId, properties?: AnalyticsProperties) {
			ensure()?.identify(distinctId, properties);
		},
		reset() {
			ensure()?.reset();
		},
	};
}
