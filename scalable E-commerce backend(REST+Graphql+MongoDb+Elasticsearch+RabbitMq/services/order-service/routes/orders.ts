import { Router } from "express";

import { getOrder, listOrders, updateOrderStatus } from "../controllers/orderController";
import {
	validateListOrdersQuery,
	validateOrderId,
	validateRequest,
	validateUpdateOrderStatus
} from "../middlewares/orderValidation";

const router = Router();

router.get("/", validateListOrdersQuery, validateRequest, listOrders);
router.get("/:id", validateOrderId, validateRequest, getOrder);
router.patch("/:id/status", validateOrderId, validateUpdateOrderStatus, validateRequest, updateOrderStatus);

export default router;