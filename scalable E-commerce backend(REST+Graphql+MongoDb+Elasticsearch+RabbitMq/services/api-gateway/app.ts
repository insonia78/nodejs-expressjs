import { createGraphqlHandler, createServiceApp, errorHandler, getServiceConfig, notFoundHandler } from "../../packages/common/src";

import { rootValue, schema } from "./graphql/schema";
import { attachUserIfPresent } from "./middlewares/optionalAuth";
import restRoutes from "./routes/rest";

const gatewayConfig = getServiceConfig("gateway", 4000);
const app = createServiceApp("gateway");

app.use(attachUserIfPresent(gatewayConfig.jwtSecret));
app.get("/health", (_req, res) => {
	res.json({ service: "gateway", status: "ok" });
});
app.use("/api", restRoutes);
app.post("/graphql", createGraphqlHandler(schema, rootValue));
app.use(notFoundHandler);
app.use(errorHandler);

export default app;