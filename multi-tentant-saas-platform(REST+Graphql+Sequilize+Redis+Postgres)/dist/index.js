"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const graphql_1 = require("graphql");
const sequelize_1 = require("./database/sequelize");
require("./database/models");
const schema_1 = require("./graphql/schema");
const auth_1 = __importDefault(require("./routes/auth"));
const tenants_1 = __importDefault(require("./routes/tenants"));
const users_1 = __importDefault(require("./routes/users"));
const authJwt_1 = require("./middlewares/authJwt");
const cache_1 = require("./middlewares/cache");
const errorHandler_1 = require("./middlewares/errorHandler");
const logger_1 = require("./middlewares/logger");
const redis_1 = require("./utils/redis");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, helmet_1.default)());
app.use(logger_1.requestLogger);
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/auth", auth_1.default);
app.post("/graphql", authJwt_1.authenticateToken, (0, cache_1.cacheResponse)(), async (req, res, next) => {
    const source = typeof req.body?.query === "string" ? req.body.query : "";
    if (!source) {
        res.status(400).json({ message: "GraphQL query is required" });
        return;
    }
    try {
        const result = await (0, graphql_1.graphql)({
            schema: schema_1.schema,
            source,
            rootValue: schema_1.rootValue,
            variableValues: req.body?.variables && typeof req.body.variables === "object"
                ? req.body.variables
                : undefined
        });
        res.status(result.errors?.length ? 400 : 200).json(result);
    }
    catch (error) {
        next(error);
    }
});
app.use("/tenants", tenants_1.default);
app.use("/users", users_1.default);
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
process.on("SIGINT", () => {
    void (0, redis_1.disconnectRedis)().finally(() => process.exit(0));
});
process.on("SIGTERM", () => {
    void (0, redis_1.disconnectRedis)().finally(() => process.exit(0));
});
const startServer = async () => {
    await (0, sequelize_1.connectDatabase)();
    await (0, sequelize_1.syncDatabase)();
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
};
exports.startServer = startServer;
if (require.main === module) {
    void (0, exports.startServer)().catch((error) => {
        console.error("Failed to start server", error);
        process.exit(1);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map