"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { defineConfig } = require("vitest/config");
module.exports = defineConfig({
    test: {
        environment: "node",
        include: ["tests/**/*.test.ts"]
    }
});
//# sourceMappingURL=vitest.config.js.map