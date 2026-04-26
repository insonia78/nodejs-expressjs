import { Router } from "express";

import { addCartItem, checkout, clearCart, getCart, removeCartItem, updateCartItem } from "../controllers/cartController";
import {
	validateAddCartItem,
	validateCartQuery,
	validateCheckout,
	validateProductIdParam,
	validateRequest,
	validateUpdateCartItem
} from "../middlewares/cartValidation";

const router = Router();

router.get("/", validateCartQuery, validateRequest, getCart);
router.post("/items", validateAddCartItem, validateRequest, addCartItem);
router.patch("/items/:productId", validateUpdateCartItem, validateRequest, updateCartItem);
router.delete("/items/:productId", validateProductIdParam, validateRequest, removeCartItem);
router.delete("/", validateCartQuery, validateRequest, clearCart);
router.post("/checkout", validateCheckout, validateRequest, checkout);

export default router;