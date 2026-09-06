import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/web-components-vite";
import { mergeConfig } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(dirname, "../../..");

const config: StorybookConfig = {
	framework: "@storybook/web-components-vite",
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|ts)"],
	addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
	docs: {
		autodocs: "tag",
	},
	async viteFinal(config) {
		return mergeConfig(config, {
			publicDir: path.join(dirname, "../public"),
			resolve: {
				alias: {
					"@lukebrannagan/design-system": path.join(workspaceRoot, "libs/design-system/src"),
					"@lukebrannagan/content": path.join(workspaceRoot, "libs/content/src"),
				},
			},
		});
	},
};

export default config;
