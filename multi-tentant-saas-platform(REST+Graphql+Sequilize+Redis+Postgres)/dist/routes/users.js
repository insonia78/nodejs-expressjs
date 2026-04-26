"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const usersController_1 = require("../controllers/usersController");
const authJwt_1 = require("../middlewares/authJwt");
const cache_1 = require("../middlewares/cache");
const validateRequest_1 = require("../middlewares/validateRequest");
const router = (0, express_1.Router)();
router.use(authJwt_1.authenticateToken);
router.get("/", (0, cache_1.cacheResponse)(), (0, express_validator_1.query)("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be an integer between 1 and 100"), validateRequest_1.validateRequest, usersController_1.getUsers);
router.post("/", (0, cache_1.cacheResponse)(), (0, express_validator_1.body)("email")
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
    .withMessage("email must be a valid email address"), (0, express_validator_1.body)("tenant_id")
    .exists({ values: "falsy" })
    .withMessage("tenant_id is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("tenant_id must be a positive integer"), (0, express_validator_1.body)("role")
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
    .withMessage("role must be between 2 and 50 characters"), validateRequest_1.validateRequest, (0, cache_1.invalidateCache)(["api-cache:GET:/users", "api-cache:POST:/users", "api-cache:POST:root:/graphql"]), usersController_1.createUser);
exports.default = router;
//# sourceMappingURL=users.js.map