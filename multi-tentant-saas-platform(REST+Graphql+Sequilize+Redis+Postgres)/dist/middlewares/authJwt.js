"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Missing or invalid Authorization header" });
        return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Missing token" });
        return;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        res.status(500).json({ message: "JWT_SECRET is not configured" });
        return;
    }
    jsonwebtoken_1.default.verify(token, secret, (error) => {
        if (error) {
            res.status(403).json({ message: "Invalid or expired token" });
            return;
        }
        next();
    });
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=authJwt.js.map