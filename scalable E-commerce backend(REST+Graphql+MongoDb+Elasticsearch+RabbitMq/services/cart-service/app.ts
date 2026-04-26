import { createGraphqlHandler, createServiceApp, errorHandler, notFoundHandler } from "../../packages/common/src";

import { rootValue, schema } from "./graphql/schema";
import cartRoutes from "./routes/cart";

const app = createServiceApp("cart");

app.get("/health", (_req, res) => {
	res.json({ service: "cart", status: "ok" });
});
app.use("/cart", cartRoutes);
app.post("/graphql", createGraphqlHandler(schema, rootValue));
app.use(notFoundHandler);
app.use(errorHandler);

export default app;