"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const cache_1 = require("../middlewares/cache");
const validateRequest_1 = require("../middlewares/validateRequest");
const router = (0, express_1.Router)();
router.post("/token", (0, cache_1.cacheResponse)(), (0, express_validator_1.body)("userId")
    .exists({ values: "falsy" })
    .withMessage("userId is required")
    .bail()
    .isString()
    .withMessage("userId must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("userId cannot be empty"), validateRequest_1.validateRequest, authController_1.generateToken);
exports.default = router;
//# sourceMappingURL=auth.js.map