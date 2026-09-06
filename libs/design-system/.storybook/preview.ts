import type { Preview } from "@storybook/web-components-vite";
import { applyTheme, type Theme } from "../src/theme";
import "../src/styles/global.css";
import "../src/index";

const preview: Preview = {
	parameters: {
		layout: "padded",
		controls: { matchers: { color: /(background|color)$/i } },
		a11y: { test: "todo" },
		options: {
			storySort: {
				order: ["Introduction", "Foundations", "Components"],
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
