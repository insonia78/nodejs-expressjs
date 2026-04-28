import { DashboardSnapshot } from "../../types";

export interface DashboardProps {
  snapshot: DashboardSnapshot | null;
  isConnected: boolean;
}