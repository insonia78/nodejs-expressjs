import { Router } from "express";

import { getInventory, listInventory, upsertInventory } from "../controllers/inventoryController";
import { validateProductId, validateRequest, validateUpsertInventory } from "../middlewares/inventoryValidation";

const router = Router();

router.get("/", listInventory);
router.get("/:productId", validateProductId, validateRequest, getInventory);
router.post("/", validateUpsertInventory, validateRequest, upsertInventory);

export default router;