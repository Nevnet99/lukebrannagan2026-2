import { applyTheme, type Theme } from "@lukebrannagan/design-system/theme";
import type { Preview } from "@storybook/web-components-vite";
import "@lukebrannagan/design-system/styles/global.css";
import "../src/styles/surfaces.css";
import "../src/styles/atmosphere.css";
import "@lukebrannagan/design-system";

const preview: Preview = {
	parameters: {
		layout: "fullscreen",
		controls: { matchers: { color: /(background|color)$/i } },
		a11y: { test: "todo" },
		options: {
			storySort: {
				order: ["Introduction", "Shell", "Sections", "Components"],
			},
		},
	},
	globalTypes: {
		theme: {
			description: "Color theme",
			toolbar: {
				title: "Theme",
				icon: "mirror",
				items: [
					{ value: "light", title: "Light" },
					{ value: "dark", title: "Dark" },
				],
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: {
		theme: "light",
	},
	decorators: [
		(story, context) => {
			const theme = (context.globals.theme as Theme) ?? "light";
			applyTheme(theme);
			document.body.style.background = "var(--color-bg)";
			document.body.style.color = "var(--color-fg)";
			document.body.style.margin = "0";
			document.body.style.minHeight = "100vh";
			return story();
		},
	],
};

export default preview;
