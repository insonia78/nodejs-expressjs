import { DashboardSnapshot } from "../../types";

export const createEmptySnapshot = (): DashboardSnapshot => ({
  summary: [],
  topPages: [],
  deviceBreakdown: [],
  hourly: [],
  daily: [],
  generatedAt: new Date(0).toISOString()
});