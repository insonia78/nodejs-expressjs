import { Router } from "express";

import { createServiceProxy } from "../controllers/proxyController";

const router = Router();

router.use("/catalog", createServiceProxy("catalog", "/api/catalog"));
router.use("/cart", createServiceProxy("cart", "/api/cart"));
router.use("/orders", createServiceProxy("orders", "/api/orders"));
router.use("/payments", createServiceProxy("payments", "/api/payments"));
router.use("/inventory", createServiceProxy("inventory", "/api/inventory"));
router.use("/users", createServiceProxy("users", "/api/users"));

export default router;