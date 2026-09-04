import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["libs/**/src/**/*.test.ts"],
		environment: "node",
	},
});
