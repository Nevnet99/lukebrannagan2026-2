import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";

const root = fileURLToPath(new URL("../..", import.meta.url));

// https://astro.build/config
export default defineConfig({
	site: "https://lukebrannagan.com",
	output: "static",
	outDir: "../../dist/apps/site",
	integrations: [],
	vite: {
		resolve: {
			alias: {
				"@lukebrannagan/design-system": `${root}/libs/design-system/src`,
				"@lukebrannagan/content": `${root}/libs/content/src`,
			},
		},
	},
});
