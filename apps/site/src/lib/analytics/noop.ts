import type { Analytics, AnalyticsProperties } from "./types";

/** No-op facade when PostHog is disabled or misconfigured. */
export function createNoopAnalytics(): Analytics {
	return {
		enabled: false,
		async init() {},
		capture(_event: string, _properties?: AnalyticsProperties) {},
		identify(_distinctId: string, _properties?: AnalyticsProperties) {},
		reset() {},
	};
}
