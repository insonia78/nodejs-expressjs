import { Router } from "express";
import { body } from "express-validator";
import { ingestEvent } from "../controllers/trackController";
import { validateRequest } from "../middlewares/validateRequest";

const router = Router();

router.post(
  "/",
  [
    body("event").isString().trim().notEmpty(),
    body("path").isString().trim().notEmpty(),
    body("visitorId").optional().isString(),
    body("sessionId").optional().isString(),
    body("site").optional().isString(),
    body("referrer").optional().isString(),
    body("metadata").optional().isObject()
  ],
  validateRequest,
  ingestEvent
);

export default router;