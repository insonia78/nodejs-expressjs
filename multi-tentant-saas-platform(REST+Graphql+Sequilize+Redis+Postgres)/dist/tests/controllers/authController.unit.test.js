"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const httpMocks_1 = require("../helpers/httpMocks");
const { mockSign, mockVerify, mockDebug, mockInfo, mockError } = vitest_1.vi.hoisted(() => ({
    mockSign: vitest_1.vi.fn(),
    mockVerify: vitest_1.vi.fn(),
    mockDebug: vitest_1.vi.fn(),
    mockInfo: vitest_1.vi.fn(),
    mockError: vitest_1.vi.fn()
}));
vitest_1.vi.mock("jsonwebtoken", () => ({
    default: {
        sign: mockSign,
        verify: mockVerify
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
        mockSign.mockReturnValueOnce("signed-token").mockReturnValueOnce("signed-refresh-token");
        const req = { body: { userId: "user-1" } };
        const { res, status, json } = (0, httpMocks_1.createMockResponse)();
        (0, authController_1.generateToken)(req, res);
        (0, vitest_1.expect)(mockSign).toHaveBeenCalledWith({ sub: "user-1" }, "test-secret", { expiresIn: "1h" });
        (0, vitest_1.expect)(mockSign).toHaveBeenCalledWith({ sub: "user-1", type: "refresh" }, "test-secret", { expiresIn: "7d" });
        (0, vitest_1.expect)(status).toHaveBeenCalledWith(200);
        (0, vitest_1.expect)(json).toHaveBeenCalledWith({
            message: "Tokens generated successfully",
            token: "signed-token",
            refreshToken: "signed-refresh-token"
        });
        (0, vitest_1.expect)(mockInfo).toHaveBeenCalledWith("POST /auth/token - tokens generated", {
            status: 200
        });
    });
});
(0, vitest_1.describe)("authController.refreshToken", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        delete process.env.JWT_SECRET;
    });
    (0, vitest_1.it)("returns 500 when JWT secret is missing", () => {
        const req = { body: { refreshToken: "refresh-token" } };
        const { res, status, json } = (0, httpMocks_1.createMockResponse)();
        (0, authController_1.refreshToken)(req, res);
        (0, vitest_1.expect)(status).toHaveBeenCalledWith(500);
        (0, vitest_1.expect)(json).toHaveBeenCalledWith({ message: "JWT_SECRET is not configured" });
        (0, vitest_1.expect)(mockError).toHaveBeenCalledWith("POST /auth/refresh - JWT_SECRET not configured");
        (0, vitest_1.expect)(mockVerify).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)("returns 401 when refresh token verification fails", () => {
        process.env.JWT_SECRET = "test-secret";
        mockVerify.mockImplementation(() => {
            throw new Error("invalid token");
        });
        const req = { body: { refreshToken: "bad-refresh-token" } };
        const { res, status, json } = (0, httpMocks_1.createMockResponse)();
        (0, authController_1.refreshToken)(req, res);
        (0, vitest_1.expect)(mockVerify).toHaveBeenCalledWith("bad-refresh-token", "test-secret");
        (0, vitest_1.expect)(status).toHaveBeenCalledWith(401);
        (0, vitest_1.expect)(json).toHaveBeenCalledWith({ message: "Invalid refresh token" });
    });
    (0, vitest_1.it)("returns new tokens when refresh token is valid", () => {
        process.env.JWT_SECRET = "test-secret";
        mockVerify.mockReturnValue({ sub: "user-1", type: "refresh" });
        mockSign.mockReturnValueOnce("new-access-token").mockReturnValueOnce("new-refresh-token");
        const req = { body: { refreshToken: "valid-refresh-token" } };
        const { res, status, json } = (0, httpMocks_1.createMockResponse)();
        (0, authController_1.refreshToken)(req, res);
        (0, vitest_1.expect)(mockVerify).toHaveBeenCalledWith("valid-refresh-token", "test-secret");
        (0, vitest_1.expect)(mockSign).toHaveBeenCalledWith({ sub: "user-1" }, "test-secret", { expiresIn: "1h" });
        (0, vitest_1.expect)(mockSign).toHaveBeenCalledWith({ sub: "user-1", type: "refresh" }, "test-secret", { expiresIn: "7d" });
        (0, vitest_1.expect)(status).toHaveBeenCalledWith(200);
        (0, vitest_1.expect)(json).toHaveBeenCalledWith({
            message: "Token refreshed successfully",
            token: "new-access-token",
            refreshToken: "new-refresh-token"
        });
        (0, vitest_1.expect)(mockInfo).toHaveBeenCalledWith("POST /auth/refresh - token refreshed", {
            status: 200
        });
    });
});
//# sourceMappingURL=authController.unit.test.js.map