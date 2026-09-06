const CONSENT_KEY = "lb-analytics-consent";

export type AnalyticsConsent = "granted" | "denied";

export function readAnalyticsConsent(): AnalyticsConsent | null {
	if (typeof localStorage === "undefined") return null;
	try {
		const value = localStorage.getItem(CONSENT_KEY);
		if (value === "granted" || value === "denied") return value;
	} catch {
		/* private mode / blocked storage */
	}
	return null;
}

export function writeAnalyticsConsent(value: AnalyticsConsent) {
	try {
		localStorage.setItem(CONSENT_KEY, value);
	} catch {
		/* ignore */
	}
	window.dispatchEvent(new CustomEvent("lb:analytics-consent", { detail: { value } }));
}

export function hasAnalyticsConsent(): boolean {
	return readAnalyticsConsent() === "granted";
}
