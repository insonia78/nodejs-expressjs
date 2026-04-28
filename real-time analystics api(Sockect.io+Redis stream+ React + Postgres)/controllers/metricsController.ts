import { NextFunction, Request, Response } from "express";
import { getMetricsSnapshot } from "../services/metricsService";

export const getDashboardMetrics = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const snapshot = await getMetricsSnapshot();
    res.json(snapshot);
  } catch (error) {
    next(error);
  }
};