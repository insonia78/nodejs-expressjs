import { DashboardSnapshot } from "../../types";

export const buildDashboardTitle = (snapshot: DashboardSnapshot | null): string => {
  if (!snapshot) {
    return "Waiting for live traffic";
  }

  return `Updated ${new Date(snapshot.generatedAt).toLocaleTimeString()}`;
};