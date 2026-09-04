/** Public entry for the design system — tokens + component paths for Astro apps. */
export const designSystemPaths = {
	globalStyles: new URL("./styles/global.css", import.meta.url).pathname,
} as const;

export type SpacingToken = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export type TextVariant = "display" | "title" | "body" | "meta" | "muted";
