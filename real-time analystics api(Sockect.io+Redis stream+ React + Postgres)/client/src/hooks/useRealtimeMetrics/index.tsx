import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { DashboardSnapshot } from "../../types";
import { getApiBaseUrl } from "./functions";
import { UseRealtimeMetricsResult } from "./models";

export const useRealtimeMetrics = (): UseRealtimeMetricsResult => {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const apiBaseUrl = getApiBaseUrl();

    void fetch(`${apiBaseUrl}/metrics/dashboard`)
      .then((response) => response.json())
      .then((payload: DashboardSnapshot) => {
        setSnapshot(payload);
      })
      .catch(() => undefined);

    const socket = io(apiBaseUrl, {
      path: "/socket.io"
    });

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("metrics:update", (nextSnapshot: DashboardSnapshot) => {
      setSnapshot(nextSnapshot);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return {
    snapshot,
    isConnected
  };
};