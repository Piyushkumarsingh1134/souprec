"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const authenticate = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1]; // Bearer <token>
    console.log(token);
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded; // ✅ cast to any
        next();
    }
    catch (error) {
        return res.status(403).json({ error: "Invalid token" });
    }
};
exports.authenticate = authenticate;
