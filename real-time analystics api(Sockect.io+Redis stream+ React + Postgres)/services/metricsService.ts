import {
  getDailyStats,
  getHourlyStats,
  getTopPages,
  getTrafficBreakdown,
  getVisitorSummary
} from "../database/eventsRepository";
import { DashboardSnapshot } from "../types/analytics";

export const getMetricsSnapshot = async (): Promise<DashboardSnapshot> => {
  const [summary, topPages, deviceBreakdown, hourly, daily] = await Promise.all([
    getVisitorSummary(),
    getTopPages(),
    getTrafficBreakdown("device_type"),
    getHourlyStats(),
    getDailyStats()
  ]);

  return {
    summary,
    topPages,
    deviceBreakdown,
    hourly,
    daily,
    generatedAt: new Date().toISOString()
  };
};