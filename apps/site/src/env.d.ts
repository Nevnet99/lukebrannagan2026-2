/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly PUBLIC_AMAZON_ASSOCIATE_TAG?: string;
	/** PostHog project API key (publishable). Empty disables analytics. */
	readonly PUBLIC_POSTHOG_KEY?: string;
	/** PostHog ingest host — e.g. https://eu.i.posthog.com or https://us.i.posthog.com */
	readonly PUBLIC_POSTHOG_HOST?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
