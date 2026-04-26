import { createGraphqlHandler, createServiceApp, errorHandler, notFoundHandler } from "../../packages/common/src";

import { rootValue, schema } from "./graphql/schema";
import inventoryRoutes from "./routes/inventory";

const app = createServiceApp("inventory");

app.get("/health", (_req, res) => {
	res.json({ service: "inventory", status: "ok" });
});
app.use("/inventory", inventoryRoutes);
app.post("/graphql", createGraphqlHandler(schema, rootValue));
app.use(notFoundHandler);
app.use(errorHandler);

export default app;