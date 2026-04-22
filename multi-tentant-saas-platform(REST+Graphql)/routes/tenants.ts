import { Router } from "express";
import { body } from "express-validator";
import { createTenant } from "../controllers/tenantsController";
import { authenticateToken } from "../middlewares/authJwt";
import { cacheResponse, invalidateCache } from "../middlewares/cache";
import { validateRequest } from "../middlewares/validateRequest";

const router = Router();

router.use(authenticateToken);

router.post(
	"/",
	cacheResponse(),
	body("id")
		.exists({ values: "falsy" })
		.withMessage("id is required")
		.bail()
		.isInt({ min: 1 })
		.withMessage("id must be a positive integer"),
	body("name")
		.exists({ values: "falsy" })
		.withMessage("name is required")
		.bail()
		.isString()
		.withMessage("name must be a string")
		.bail()
		.trim()
		.notEmpty()
		.withMessage("name cannot be empty")
		.bail()
		.isLength({ min: 2, max: 100 })
		.withMessage("name must be between 2 and 100 characters"),
	body("plan")
		.exists({ values: "falsy" })
		.withMessage("plan is required")
		.bail()
		.isString()
		.withMessage("plan must be a string")
		.bail()
		.trim()
		.notEmpty()
		.withMessage("plan cannot be empty")
		.bail()
		.isLength({ min: 2, max: 50 })
		.withMessage("plan must be between 2 and 50 characters"),
	validateRequest,
	invalidateCache(["api-cache:GET:/tenants", "api-cache:POST:/tenants", "api-cache:POST:root:/graphql"]),
	createTenant
);

export default router;
