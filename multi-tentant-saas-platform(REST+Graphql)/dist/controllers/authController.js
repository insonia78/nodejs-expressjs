"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
require("dotenv/config");
const generateToken = (req, res) => {
    logger_1.logger.debug("POST /auth/token - incoming request");
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        logger_1.logger.error("POST /auth/token - JWT_SECRET not configured");
        res.status(500).json({ message: "JWT_SECRET is not configured" });
        return;
    }
    const { userId } = req.body;
    const token = jsonwebtoken_1.default.sign({ sub: userId }, secret, { expiresIn: "1h" });
    const response = {
        message: "Token generated successfully",
        token
    };
    logger_1.logger.info("POST /auth/token - token generated", { status: 200 });
    res.status(200).json(response);
};
exports.generateToken = generateToken;
//# sourceMappingURL=authController.js.map