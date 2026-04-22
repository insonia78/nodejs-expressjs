import { Router } from "express";
import { body } from "express-validator";
import { generateToken } from "../controllers/authController";
import { cacheResponse } from "../middlewares/cache";
import { validateRequest } from "../middlewares/validateRequest";

const router = Router();

router.post(
	"/token",
	cacheResponse(),
	body("userId")
		.exists({ values: "falsy" })
		.withMessage("userId is required")
		.bail()
		.isString()
		.withMessage("userId must be a string")
		.bail()
		.trim()
		.notEmpty()
		.withMessage("userId cannot be empty"),
	validateRequest,
	generateToken
);

export default router;
