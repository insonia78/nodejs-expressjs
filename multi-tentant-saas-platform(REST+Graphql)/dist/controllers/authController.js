"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
require("dotenv/config");
const accessTokenExpiresIn = "1h";
const refreshTokenExpiresIn = "7d";
const getJwtSecret = () => process.env.JWT_SECRET;
const createAccessToken = (userId, secret) => jsonwebtoken_1.default.sign({ sub: userId }, secret, { expiresIn: accessTokenExpiresIn });
const createRefreshToken = (userId, secret) => jsonwebtoken_1.default.sign({ sub: userId, type: "refresh" }, secret, { expiresIn: refreshTokenExpiresIn });
const getRefreshTokenSubject = (token, secret) => {
    const decoded = jsonwebtoken_1.default.verify(token, secret);
    if (typeof decoded === "string") {
        return undefined;
    }
    return typeof decoded.sub === "string" ? decoded.sub : undefined;
};
const generateToken = (req, res) => {
    logger_1.logger.debug("POST /auth/token - incoming request");
    const secret = getJwtSecret();
    if (!secret) {
        logger_1.logger.error("POST /auth/token - JWT_SECRET not configured");
        res.status(500).json({ message: "JWT_SECRET is not configured" });
        return;
    }
    const { userId } = req.body;
    const token = createAccessToken(userId, secret);
    const refreshToken = createRefreshToken(userId, secret);
    const response = {
        message: "Tokens generated successfully",
        token,
        refreshToken
    };
    logger_1.logger.info("POST /auth/token - tokens generated", { status: 200 });
    res.status(200).json(response);
};
exports.generateToken = generateToken;
const refreshToken = (req, res) => {
    logger_1.logger.debug("POST /auth/refresh - incoming request");
    const secret = getJwtSecret();
    if (!secret) {
        logger_1.logger.error("POST /auth/refresh - JWT_SECRET not configured");
        res.status(500).json({ message: "JWT_SECRET is not configured" });
        return;
    }
    try {
        const userId = getRefreshTokenSubject(req.body.refreshToken, secret);
        if (!userId) {
            logger_1.logger.error("POST /auth/refresh - invalid refresh token");
            res.status(401).json({ message: "Invalid refresh token" });
            return;
        }
        const response = {
            message: "Token refreshed successfully",
            token: createAccessToken(userId, secret),
            refreshToken: createRefreshToken(userId, secret)
        };
        logger_1.logger.info("POST /auth/refresh - token refreshed", { status: 200 });
        res.status(200).json(response);
    }
    catch (error) {
        logger_1.logger.error("POST /auth/refresh - invalid refresh token", { error });
        res.status(401).json({ message: "Invalid refresh token" });
        return;
    }
};
exports.refreshToken = refreshToken;
//# sourceMappingURL=authController.js.map