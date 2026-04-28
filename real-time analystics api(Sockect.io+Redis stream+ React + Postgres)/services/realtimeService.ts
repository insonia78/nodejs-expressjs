import { Server as SocketIOServer } from "socket.io";
import { DashboardSnapshot } from "../types/analytics";

let io: SocketIOServer | null = null;

export const setRealtimeServer = (server: SocketIOServer): void => {
  io = server;
};

export const broadcastMetrics = (snapshot: DashboardSnapshot): void => {
  io?.emit("metrics:update", snapshot);
};