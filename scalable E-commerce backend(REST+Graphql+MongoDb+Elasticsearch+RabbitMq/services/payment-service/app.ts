import { createGraphqlHandler, createServiceApp, errorHandler, notFoundHandler } from "../../packages/common/src";

import { rootValue, schema } from "./graphql/schema";
import paymentRoutes from "./routes/payments";

const app = createServiceApp("payments");

app.get("/health", (_req, res) => {
	res.json({ service: "payments", status: "ok" });
});
app.use("/payments", paymentRoutes);
app.post("/graphql", createGraphqlHandler(schema, rootValue));
app.use(notFoundHandler);
app.use(errorHandler);

export default app;