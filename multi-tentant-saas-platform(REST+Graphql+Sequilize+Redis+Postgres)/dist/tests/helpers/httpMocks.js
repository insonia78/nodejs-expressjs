"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockResponse = void 0;
const vitest_1 = require("vitest");
const createMockResponse = () => {
    const json = vitest_1.vi.fn();
    const status = vitest_1.vi.fn(() => ({ json }));
    return {
        res: { status },
        status,
        json
    };
};
exports.createMockResponse = createMockResponse;
//# sourceMappingURL=httpMocks.js.map