"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const httpMocks_1 = require("../helpers/httpMocks");
const { mockSign, mockDebug, mockInfo, mockError } = vitest_1.vi.hoisted(() => ({
    mockSign: vitest_1.vi.fn(),
    mockDebug: vitest_1.vi.fn(),
    mockInfo: vitest_1.vi.fn(),
    mockError: vitest_1.vi.fn()
}));
vitest_1.vi.mock("jsonwebtoken", () => ({
    default: {
        sign: mockSign
    }
}));
vitest_1.vi.mock("../../utils/logger", () => ({
    logger: {
        debug: mockDebug,
        info: mockInfo,
        error: mockError
    }
}));
const authController_1 = require("../../controllers/authController");
(0, vitest_1.describe)("authController.generateToken", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        delete process.env.JWT_SECRET;
    });
    (0, vitest_1.it)("returns 500 when JWT secret is missing", () => {
        const req = { body: { userId: "user-1" } };
        const { res, status, json } = (0, httpMocks_1.createMockResponse)();
        (0, authController_1.generateToken)(req, res);
        (0, vitest_1.expect)(status).toHaveBeenCalledWith(500);
        (0, vitest_1.expect)(json).toHaveBeenCalledWith({ message: "JWT_SECRET is not configured" });
        (0, vitest_1.expect)(mockError).toHaveBeenCalledWith("POST /auth/token - JWT_SECRET not configured");
        (0, vitest_1.expect)(mockSign).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)("returns a signed token when JWT secret exists", () => {
        process.env.JWT_SECRET = "test-secret";
        mockSign.mockReturnValue("signed-token");
        const req = { body: { userId: "user-1" } };
        const { res, status, json } = (0, httpMocks_1.createMockResponse)();
        (0, authController_1.generateToken)(req, res);
        (0, vitest_1.expect)(mockSign).toHaveBeenCalledWith({ sub: "user-1" }, "test-secret", { expiresIn: "1h" });
        (0, vitest_1.expect)(status).toHaveBeenCalledWith(200);
        (0, vitest_1.expect)(json).toHaveBeenCalledWith({
            message: "Token generated successfully",
            token: "signed-token"
        });
        (0, vitest_1.expect)(mockInfo).toHaveBeenCalledWith("POST /auth/token - token generated", {
            status: 200
        });
    });
});
//# sourceMappingURL=authController.unit.test.js.map