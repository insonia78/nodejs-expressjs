"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const httpMocks_1 = require("../helpers/httpMocks");
const { mockFindAll, mockCreate, mockDebug, mockInfo, mockError } = vitest_1.vi.hoisted(() => ({
    mockFindAll: vitest_1.vi.fn(),
    mockCreate: vitest_1.vi.fn(),
    mockDebug: vitest_1.vi.fn(),
    mockInfo: vitest_1.vi.fn(),
    mockError: vitest_1.vi.fn()
}));
vitest_1.vi.mock("../../database/models", () => ({
    User: {
        findAll: mockFindAll,
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
const usersController_1 = require("../../controllers/usersController");
(0, vitest_1.describe)("usersController", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("getUsers returns mapped users with limit", async () => {
        mockFindAll.mockResolvedValue([
            { id: 1, email: "alice@example.com", tenant_id: 1, role: "admin" }
        ]);
        const req = { query: { limit: "1" } };
        const { res, status, json } = (0, httpMocks_1.createMockResponse)();
        await (0, usersController_1.getUsers)(req, res);
        (0, vitest_1.expect)(mockFindAll).toHaveBeenCalledWith({
            attributes: ["id", "email", "tenant_id", "role"],
            limit: 1,
            order: [["id", "ASC"]]
        });
        (0, vitest_1.expect)(status).toHaveBeenCalledWith(200);
        (0, vitest_1.expect)(json).toHaveBeenCalledWith({
            message: "Users fetched successfully",
            data: [{ id: 1, email: "alice@example.com", tenant_id: 1, role: "admin" }]
        });
    });
    (0, vitest_1.it)("getUsers returns 500 when the database query fails", async () => {
        mockFindAll.mockRejectedValue(new Error("db error"));
        const req = { query: {} };
        const { res, status, json } = (0, httpMocks_1.createMockResponse)();
        await (0, usersController_1.getUsers)(req, res);
        (0, vitest_1.expect)(status).toHaveBeenCalledWith(500);
        (0, vitest_1.expect)(json).toHaveBeenCalledWith({ message: "Failed to fetch users", data: [] });
        (0, vitest_1.expect)(mockError).toHaveBeenCalledWith("GET /users - database query failed");
    });
    (0, vitest_1.it)("createUser persists a user and returns the created payload", async () => {
        mockCreate.mockResolvedValue({
            id: 10,
            email: "charlie@example.com",
            tenant_id: 1,
            role: "admin"
        });
        const req = { body: { email: "charlie@example.com", tenant_id: 1, role: "admin" } };
        const { res, status, json } = (0, httpMocks_1.createMockResponse)();
        await (0, usersController_1.createUser)(req, res);
        (0, vitest_1.expect)(mockCreate).toHaveBeenCalledWith({
            email: "charlie@example.com",
            tenant_id: 1,
            role: "admin"
        });
        (0, vitest_1.expect)(status).toHaveBeenCalledWith(201);
        (0, vitest_1.expect)(json).toHaveBeenCalledWith({
            message: "User created successfully",
            data: {
                id: 10,
                email: "charlie@example.com",
                tenant_id: 1,
                role: "admin"
            }
        });
        (0, vitest_1.expect)(mockInfo).toHaveBeenCalledWith("POST /users - user created", {
            status: 201,
            role: "admin"
        });
    });
    (0, vitest_1.it)("createUser returns 500 when persistence fails", async () => {
        mockCreate.mockRejectedValue(new Error("insert failed"));
        const req = { body: { email: "charlie@example.com", tenant_id: 1, role: "admin" } };
        const { res, status, json } = (0, httpMocks_1.createMockResponse)();
        await (0, usersController_1.createUser)(req, res);
        (0, vitest_1.expect)(status).toHaveBeenCalledWith(500);
        (0, vitest_1.expect)(json).toHaveBeenCalledWith({
            message: "Failed to create user",
            data: { id: 0, email: "", tenant_id: 0, role: "" }
        });
        (0, vitest_1.expect)(mockError).toHaveBeenCalledWith("POST /users - database insert failed");
    });
});
//# sourceMappingURL=usersController.unit.test.js.map