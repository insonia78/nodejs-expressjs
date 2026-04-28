import { DashboardSnapshot } from "../../types";

export interface AnalyticsStoreContextValue {
  snapshot: DashboardSnapshot | null;
  isConnected: boolean;
  setSnapshot: (snapshot: DashboardSnapshot) => void;
  setIsConnected: (value: boolean) => void;
}