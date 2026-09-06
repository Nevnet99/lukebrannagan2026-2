import { fileURLToPath } from "node:url";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const root = fileURLToPath(new URL("../..", import.meta.url));

// https://astro.build/config
export default defineConfig({
	site: "https://lukebrannagan.com",
	output: "static",
	outDir: "../../dist/apps/site",
	integrations: [
		sitemap({
			filter: (page) =>
				!page.includes("/404") &&
				!page.includes("/accessibility-getting-started-quick-wins") &&
				!page.includes("/if-youre-not-using-storybook") &&
				!page.includes("/usecallback-and-usememo"),
		}),
	],
	redirects: {
		"/blog": "/writing",
		"/blog/[slug]": "/writing/[slug]",
	},
	vite: {
		resolve: {
			alias: {
				"@lukebrannagan/design-system": `${root}/libs/design-system/src`,
				"@lukebrannagan/content": `${root}/libs/content/src`,
			},
		},
	},
});
