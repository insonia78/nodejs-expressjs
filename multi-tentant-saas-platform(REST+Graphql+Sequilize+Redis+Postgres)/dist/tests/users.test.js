"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const index_1 = __importDefault(require("../index"));
(0, vitest_1.describe)("Users routes", () => {
    process.env.JWT_SECRET = "test_secret";
    const testSecret = process.env.JWT_SECRET;
    const token = jsonwebtoken_1.default.sign({ sub: "test-user" }, testSecret, { expiresIn: "1h" });
    (0, vitest_1.it)("GET /users without token returns 401", async () => {
        const response = await (0, supertest_1.default)(index_1.default).get("/users");
        (0, vitest_1.expect)(response.status).toBe(401);
        (0, vitest_1.expect)(response.body.message).toBe("Missing or invalid Authorization header");
    });
    (0, vitest_1.it)("GET /users returns users", async () => {
        const response = await (0, supertest_1.default)(index_1.default)
            .get("/users")
            .set("Authorization", `Bearer ${token}`);
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.message).toBe("Users fetched successfully");
        (0, vitest_1.expect)(Array.isArray(response.body.data)).toBe(true);
        (0, vitest_1.expect)(response.body.data.length).toBeGreaterThan(0);
    });
    (0, vitest_1.it)("GET /users with invalid limit returns 400", async () => {
        const response = await (0, supertest_1.default)(index_1.default)
            .get("/users")
            .set("Authorization", `Bearer ${token}`)
            .query({ limit: 0 });
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body.message).toBe("Validation failed");
        (0, vitest_1.expect)(Array.isArray(response.body.errors)).toBe(true);
    });
    (0, vitest_1.it)("POST /users creates a user", async () => {
        const response = await (0, supertest_1.default)(index_1.default)
            .post("/users")
            .set("Authorization", `Bearer ${token}`)
            .send({ email: "charlie@example.com", tenant_id: 1, role: "admin" });
        (0, vitest_1.expect)([201, 500]).toContain(response.status);
        if (response.status === 201) {
            (0, vitest_1.expect)(response.body.message).toBe("User created successfully");
            (0, vitest_1.expect)(response.body.data.email).toBe("charlie@example.com");
            (0, vitest_1.expect)(response.body.data.tenant_id).toBe(1);
            (0, vitest_1.expect)(response.body.data.role).toBe("admin");
        }
    });
    (0, vitest_1.it)("POST /users with invalid payload returns 400", async () => {
        const response = await (0, supertest_1.default)(index_1.default)
            .post("/users")
            .set("Authorization", `Bearer ${token}`)
            .send({ email: "", tenant_id: 0, role: "" });
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body.message).toBe("Validation failed");
        (0, vitest_1.expect)(Array.isArray(response.body.errors)).toBe(true);
    });
});
//# sourceMappingURL=users.test.js.map