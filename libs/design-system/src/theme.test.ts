import { beforeEach, describe, expect, it } from "vitest";
import {
	getSystemTheme,
	isTheme,
	resolveTheme,
	setTheme,
	THEME_STORAGE_KEY,
	toggleTheme,
} from "./theme";

const memory = new Map<string, string>();

const localStorageMock: Storage = {
	get length() {
		return memory.size;
	},
	clear() {
		memory.clear();
	},
	getItem(key) {
		return memory.has(key) ? (memory.get(key) ?? null) : null;
	},
	key(index) {
		return [...memory.keys()][index] ?? null;
	},
	removeItem(key) {
		memory.delete(key);
	},
	setItem(key, value) {
		memory.set(key, String(value));
	},
};

beforeEach(() => {
	memory.clear();
	Object.defineProperty(globalThis, "localStorage", {
		configurable: true,
		value: localStorageMock,
	});
	document.documentElement.removeAttribute("data-theme");
	for (const node of document.querySelectorAll("[data-theme-transition]")) {
		node.remove();
	}
});

describe("theme", () => {
	it("validates theme values", () => {
		expect(isTheme("light")).toBe(true);
		expect(isTheme("dark")).toBe(true);
		expect(isTheme("auto")).toBe(false);
	});

	it("resolves stored preference over system", () => {
		localStorage.setItem(THEME_STORAGE_KEY, "dark");
		expect(resolveTheme()).toBe("dark");
		localStorage.setItem(THEME_STORAGE_KEY, "light");
		expect(resolveTheme()).toBe("light");
		localStorage.removeItem(THEME_STORAGE_KEY);
		expect(resolveTheme()).toBe(getSystemTheme());
	});

	it("toggles and persists", () => {
		setTheme("light");
		expect(document.documentElement.dataset.theme).toBe("light");
		expect(toggleTheme()).toBe("dark");
		expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
		expect(document.documentElement.dataset.theme).toBe("dark");
		expect(toggleTheme()).toBe("light");
	});

	it("suppresses transitions while applying a theme change", async () => {
		const nextFrame = () =>
			new Promise<void>((resolve) => {
				requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
			});

		setTheme("light");
		await nextFrame();
		expect(document.querySelector("[data-theme-transition]")).toBeNull();

		setTheme("dark");
		expect(document.documentElement.dataset.theme).toBe("dark");
		expect(document.querySelector("[data-theme-transition]")).toBeTruthy();
		await nextFrame();
		expect(document.querySelector("[data-theme-transition]")).toBeNull();
	});
});
