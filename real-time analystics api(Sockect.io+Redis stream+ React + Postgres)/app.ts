import cors from "cors";
import express from "express";
import helmet from "helmet";
import http from "node:http";
import { Server as SocketIOServer } from "socket.io";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/requestLogger";
import metricsRouter from "./routes/metrics";
import trackRouter from "./routes/track";
import { ensureTables } from "./database/postgres";
import { setRealtimeServer } from "./services/realtimeService";
import { startEventWorker } from "./services/ingestionWorker";
import { startDemoTraffic } from "./services/demoTrafficService";
import { connectRedis, disconnectRedis } from "./utils/redis";
import { getMetricsSnapshot } from "./services/metricsService";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL ?? "http://localhost:5173"
  },
  path: process.env.SOCKET_PATH ?? "/socket.io"
});

app.use(cors({ origin: process.env.CLIENT_URL ?? "http://localhost:5173" }));
app.use(helmet());
app.use(express.json());
app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/track", trackRouter);
app.use("/metrics", metricsRouter);
app.use(notFoundHandler);
app.use(errorHandler);

io.on("connection", (socket) => {
  socket.emit("metrics:connected", { connectedAt: new Date().toISOString() });

  void getMetricsSnapshot()
    .then((snapshot) => {
      socket.emit("metrics:update", snapshot);
    })
    .catch(() => undefined);
});

setRealtimeServer(io);

export const startServer = async (): Promise<void> => {
  try {
    await ensureTables();
    await connectRedis();
    await startEventWorker();
    startDemoTraffic();

    const port = Number(process.env.PORT ?? 4000);
    server.listen(port, () => {
      console.log(`Analytics API listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start analytics API", error);
    process.exit(1);
  }
};

const shutdown = async (): Promise<void> => {
  await disconnectRedis();
  server.close(() => process.exit(0));
};

process.on("SIGINT", () => {
  void shutdown();
});

process.on("SIGTERM", () => {
  void shutdown();
});

export default app;