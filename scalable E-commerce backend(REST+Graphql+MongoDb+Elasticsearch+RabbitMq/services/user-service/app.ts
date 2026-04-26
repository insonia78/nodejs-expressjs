import { createGraphqlHandler, createServiceApp, errorHandler, notFoundHandler } from "../../packages/common/src";

import { rootValue, schema } from "./graphql/schema";
import userRoutes from "./routes/users";

const app = createServiceApp("users");

app.get("/health", (_req, res) => {
	res.json({ service: "users", status: "ok" });
});
app.use("/", userRoutes);
app.post("/graphql", createGraphqlHandler(schema, rootValue));
app.use(notFoundHandler);
app.use(errorHandler);

export default app;