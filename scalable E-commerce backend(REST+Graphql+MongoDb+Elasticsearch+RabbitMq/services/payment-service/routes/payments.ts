import { Router } from "express";

import { processPaymentRequest } from "../controllers/paymentController";
import { validateProcessPayment, validateRequest } from "../middlewares/paymentValidation";

const router = Router();

router.post("/process", validateProcessPayment, validateRequest, processPaymentRequest);

export default router;