"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const tenantsController_1 = require("../controllers/tenantsController");
const authJwt_1 = require("../middlewares/authJwt");
const cache_1 = require("../middlewares/cache");
const validateRequest_1 = require("../middlewares/validateRequest");
const router = (0, express_1.Router)();
router.use(authJwt_1.authenticateToken);
router.post("/", (0, cache_1.cacheResponse)(), (0, express_validator_1.body)("id")
    .exists({ values: "falsy" })
    .withMessage("id is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("id must be a positive integer"), (0, express_validator_1.body)("name")
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
    .withMessage("name must be between 2 and 100 characters"), (0, express_validator_1.body)("plan")
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
    .withMessage("plan must be between 2 and 50 characters"), validateRequest_1.validateRequest, (0, cache_1.invalidateCache)(["api-cache:GET:/tenants", "api-cache:POST:/tenants", "api-cache:POST:root:/graphql"]), tenantsController_1.createTenant);
exports.default = router;
//# sourceMappingURL=tenants.js.map