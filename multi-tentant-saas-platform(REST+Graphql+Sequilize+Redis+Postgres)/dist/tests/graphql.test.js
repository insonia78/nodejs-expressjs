"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const index_1 = __importDefault(require("../index"));
(0, vitest_1.describe)("GraphQL routes", () => {
    process.env.JWT_SECRET = "test_secret";
    const testSecret = process.env.JWT_SECRET;
    const token = jsonwebtoken_1.default.sign({ sub: "test-user" }, testSecret, { expiresIn: "1h" });
    (0, vitest_1.it)("POST /graphql without token returns 401", async () => {
        const response = await (0, supertest_1.default)(index_1.default).post("/graphql").send({
            query: "{ users { id email tenant_id role } }"
        });
        (0, vitest_1.expect)(response.status).toBe(401);
        (0, vitest_1.expect)(response.body.message).toBe("Missing or invalid Authorization header");
    });
    (0, vitest_1.it)("POST /graphql returns limited users", async () => {
        const response = await (0, supertest_1.default)(index_1.default)
            .post("/graphql")
            .set("Authorization", `Bearer ${token}`)
            .send({ query: "query { users(limit: 1) { id email tenant_id role } }" });
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.data.users).toEqual([
            { id: 1, email: "alice@example.com", tenant_id: 1, role: "admin" }
        ]);
    });
    (0, vitest_1.it)("POST /graphql returns tenant stats", async () => {
        const response = await (0, supertest_1.default)(index_1.default)
            .post("/graphql")
            .set("Authorization", `Bearer ${token}`)
            .send({ query: "query { tenantStats { totalTenants totalUsers } }" });
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.data.tenantStats.totalTenants).toBeGreaterThan(0);
        (0, vitest_1.expect)(response.body.data.tenantStats.totalUsers).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=graphql.test.js.map