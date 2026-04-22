"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const index_1 = __importDefault(require("../index"));
(0, vitest_1.describe)("Tenants routes", () => {
    process.env.JWT_SECRET = "test_secret";
    const testSecret = process.env.JWT_SECRET;
    const token = jsonwebtoken_1.default.sign({ sub: "test-user" }, testSecret, { expiresIn: "1h" });
    (0, vitest_1.it)("POST /tenants without token returns 401", async () => {
        const response = await (0, supertest_1.default)(index_1.default).post("/tenants").send({
            id: 1,
            name: "Acme",
            plan: "pro"
        });
        (0, vitest_1.expect)(response.status).toBe(401);
        (0, vitest_1.expect)(response.body.message).toBe("Missing or invalid Authorization header");
    });
    (0, vitest_1.it)("POST /tenants creates a tenant", async () => {
        const response = await (0, supertest_1.default)(index_1.default)
            .post("/tenants")
            .set("Authorization", `Bearer ${token}`)
            .send({ id: 1, name: "Acme", plan: "pro" });
        (0, vitest_1.expect)(response.status).toBe(201);
        (0, vitest_1.expect)(response.body.message).toBe("Tenant created successfully");
        (0, vitest_1.expect)(response.body.data).toEqual({ id: 1, name: "Acme", plan: "pro" });
    });
    (0, vitest_1.it)("POST /tenants with invalid body returns 400", async () => {
        const response = await (0, supertest_1.default)(index_1.default)
            .post("/tenants")
            .set("Authorization", `Bearer ${token}`)
            .send({ id: 0, name: "", plan: "" });
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body.message).toBe("Validation failed");
        (0, vitest_1.expect)(Array.isArray(response.body.errors)).toBe(true);
    });
});
//# sourceMappingURL=tenants.test.js.map