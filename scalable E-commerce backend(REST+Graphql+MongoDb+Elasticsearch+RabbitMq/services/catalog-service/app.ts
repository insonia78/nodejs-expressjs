import { createGraphqlHandler, createServiceApp, errorHandler, notFoundHandler } from "../../packages/common/src";

import { rootValue, schema } from "./graphql/schema";
import productRoutes from "./routes/products";

const app = createServiceApp("catalog");

app.get("/health", (_req, res) => {
	res.json({ service: "catalog", status: "ok" });
});
app.use("/products", productRoutes);
app.post("/graphql", createGraphqlHandler(schema, rootValue));
app.use(notFoundHandler);
app.use(errorHandler);

export default app;