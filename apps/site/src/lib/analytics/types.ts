export type AnalyticsProperties = Record<string, unknown>;

/**
 * Narrow analytics surface used by the site.
 * Callers depend on this — never on posthog-js directly.
 */
export type Analytics = {
	readonly enabled: boolean;
	init: () => Promise<void>;
	capture: (event: string, properties?: AnalyticsProperties) => void;
	identify: (distinctId: string, properties?: AnalyticsProperties) => void;
	reset: () => void;
};
