import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		include: ["tests/**/*.test.ts"],
		clearMocks: true,
		pool: "forks",
		maxWorkers: 1,
		minWorkers: 1,
		fileParallelism: false
	}
});