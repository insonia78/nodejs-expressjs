import { Router } from "express";

import { getUser, getUsers, login, register } from "../controllers/userController";
import { validateLogin, validateRegister, validateRequest, validateUserId } from "../middlewares/userValidation";

const router = Router();

router.post("/auth/register", validateRegister, validateRequest, register);
router.post("/auth/login", validateLogin, validateRequest, login);
router.get("/users", getUsers);
router.get("/users/:id", validateUserId, validateRequest, getUser);

export default router;