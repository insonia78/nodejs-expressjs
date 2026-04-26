import { Router } from "express";

import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from "../controllers/productController";
import {
	validateCreateProduct,
	validateListProductsQuery,
	validateProductId,
	validateRequest,
	validateUpdateProduct
} from "../middlewares/productValidation";

const router = Router();

router.get("/", validateListProductsQuery, validateRequest, listProducts);
router.get("/:id", validateProductId, validateRequest, getProduct);
router.post("/", validateCreateProduct, validateRequest, createProduct);
router.put("/:id", validateProductId, validateUpdateProduct, validateRequest, updateProduct);
router.delete("/:id", validateProductId, validateRequest, deleteProduct);

export default router;