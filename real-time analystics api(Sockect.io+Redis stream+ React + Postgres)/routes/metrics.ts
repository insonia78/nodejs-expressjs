import { Router } from "express";
import { getDashboardMetrics } from "../controllers/metricsController";

const router = Router();

router.get("/dashboard", getDashboardMetrics);

export default router;