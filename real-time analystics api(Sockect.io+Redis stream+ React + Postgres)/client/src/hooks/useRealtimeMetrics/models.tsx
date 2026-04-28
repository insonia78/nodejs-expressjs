import { DashboardSnapshot } from "../../types";

export interface UseRealtimeMetricsResult {
  snapshot: DashboardSnapshot | null;
  isConnected: boolean;
}