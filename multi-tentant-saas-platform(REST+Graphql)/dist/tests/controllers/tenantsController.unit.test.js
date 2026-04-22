"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const httpMocks_1 = require("../helpers/httpMocks");
const { mockCreate, mockDebug, mockInfo, mockError } = vitest_1.vi.hoisted(() => ({
    mockCreate: vitest_1.vi.fn(),
    mockDebug: vitest_1.vi.fn(),
    mockInfo: vitest_1.vi.fn(),
    mockError: vitest_1.vi.fn()
}));
vitest_1.vi.mock("../../database/models", () => ({
    Tenant: {
        create: mockCreate
    }
}));
vitest_1.vi.mock("../../utils/logger", () => ({
    logger: {
        debug: mockDebug,
        info: mockInfo,
        error: mockError
    }
}));
const tenantsController_1 = require("../../controllers/tenantsController");
(0, vitest_1.describe)("tenantsController.createTenant", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("creates a tenant and returns the saved payload", async () => {
        mockCreate.mockResolvedValue({ id: 4, name: "Acme", plan: "pro" });
        const req = { body: { id: 4, name: "Acme", plan: "pro" } };
        const { res, status, json } = (0, httpMocks_1.createMockResponse)();
        await (0, tenantsController_1.createTenant)(req, res);
        (0, vitest_1.expect)(mockCreate).toHaveBeenCalledWith({ id: 4, name: "Acme", plan: "pro" });
        (0, vitest_1.expect)(status).toHaveBeenCalledWith(201);
        (0, vitest_1.expect)(json).toHaveBeenCalledWith({
            message: "Tenant created successfully",
            data: { id: 4, name: "Acme", plan: "pro" }
        });
        (0, vitest_1.expect)(mockInfo).toHaveBeenCalledWith("POST /tenants - tenant created", {
            status: 201,
            plan: "pro"
        });
    });
    (0, vitest_1.it)("returns 500 when tenant creation fails", async () => {
        mockCreate.mockRejectedValue(new Error("insert failed"));
        const req = { body: { id: 4, name: "Acme", plan: "pro" } };
        const { res, status, json } = (0, httpMocks_1.createMockResponse)();
        await (0, tenantsController_1.createTenant)(req, res);
        (0, vitest_1.expect)(status).toHaveBeenCalledWith(500);
        (0, vitest_1.expect)(json).toHaveBeenCalledWith({
            message: "Failed to create tenant",
            data: { id: 0, name: "", plan: "" }
        });
        (0, vitest_1.expect)(mockError).toHaveBeenCalledWith("POST /tenants - database insert failed");
    });
});
//# sourceMappingURL=tenantsController.unit.test.js.map