import { createGraphqlHandler, createServiceApp, errorHandler, notFoundHandler } from "../../packages/common/src";

import { rootValue, schema } from "./graphql/schema";
import orderRoutes from "./routes/orders";

const app = createServiceApp("orders");

app.get("/health", (_req, res) => {
	res.json({ service: "orders", status: "ok" });
});
app.use("/orders", orderRoutes);
app.post("/graphql", createGraphqlHandler(schema, rootValue));
app.use(notFoundHandler);
app.use(errorHandler);

export default app;