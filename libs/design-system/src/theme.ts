export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export function isTheme(value: unknown): value is Theme {
	return value === "light" || value === "dark";
}

export function getSystemTheme(): Theme {
	if (typeof window === "undefined" || !window.matchMedia) return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredTheme(): Theme | null {
	if (typeof localStorage === "undefined") return null;
	const value = localStorage.getItem(THEME_STORAGE_KEY);
	return isTheme(value) ? value : null;
}

/** Stored preference, otherwise system preference. */
export function resolveTheme(): Theme {
	return getStoredTheme() ?? getSystemTheme();
}

/**
 * Disable transitions for one paint so a theme flip does not smear
 * every color/background/border transition at once (better-ui).
 */
export function withoutThemeTransitions(update: () => void): void {
	if (typeof document === "undefined") {
		update();
		return;
	}

	const style = document.createElement("style");
	style.setAttribute("data-theme-transition", "");
	style.textContent = "*,*::before,*::after{transition:none!important}";
	document.head.append(style);
	update();
	// Force a reflow so the new theme commits while the override still applies.
	void document.body?.offsetHeight;
	requestAnimationFrame(() => {
		requestAnimationFrame(() => style.remove());
	});
}

export function applyTheme(theme: Theme): void {
	if (typeof document === "undefined") return;
	if (document.documentElement.dataset.theme === theme) return;
	withoutThemeTransitions(() => {
		document.documentElement.dataset.theme = theme;
	});
}

export function setTheme(theme: Theme): void {
	if (typeof localStorage !== "undefined") {
		localStorage.setItem(THEME_STORAGE_KEY, theme);
	}
	applyTheme(theme);
}

export function toggleTheme(): Theme {
	const next: Theme = resolveTheme() === "dark" ? "light" : "dark";
	setTheme(next);
	return next;
}

/** Inline boot snippet — keep in sync with resolveTheme() logic. */
export const themeBootScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k);var t=(s==="light"||s==="dark")?s:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="light";}})();`;
