import { Router } from "express";
import { body, query } from "express-validator";
import { createUser, getUsers } from "../controllers/usersController";
import { authenticateToken } from "../middlewares/authJwt";
import { cacheResponse, invalidateCache } from "../middlewares/cache";
import { validateRequest } from "../middlewares/validateRequest";

const router = Router();

router.use(authenticateToken);

router.get(
	"/",
	cacheResponse(),
	query("limit")
		.optional()
		.isInt({ min: 1, max: 100 })
		.withMessage("limit must be an integer between 1 and 100"),
	validateRequest,
	getUsers
);

router.post(
	"/",
	cacheResponse(),
	body("email")
		.exists({ values: "falsy" })
		.withMessage("email is required")
		.bail()
		.isString()
		.withMessage("email must be a string")
		.bail()
		.trim()
		.notEmpty()
		.withMessage("email cannot be empty")
		.bail()
		.isEmail()
		.withMessage("email must be a valid email address"),
	body("tenant_id")
		.exists({ values: "falsy" })
		.withMessage("tenant_id is required")
		.bail()
		.isInt({ min: 1 })
		.withMessage("tenant_id must be a positive integer"),
	body("role")
		.exists({ values: "falsy" })
		.withMessage("role is required")
		.bail()
		.isString()
		.withMessage("role must be a string")
		.bail()
		.trim()
		.notEmpty()
		.withMessage("role cannot be empty")
		.bail()
		.isLength({ min: 2, max: 50 })
		.withMessage("role must be between 2 and 50 characters"),
	validateRequest,
	invalidateCache(["api-cache:GET:/users", "api-cache:POST:/users", "api-cache:POST:root:/graphql"]),
	createUser
);

export default router;
