"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const bcrypt = __importStar(require("bcrypt"));
const Validation_1 = require("../Validation");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new client_1.PrismaClient();
const signup = async (req, res) => {
    const parsedData = Validation_1.signupSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(401).json({
            message: "Invalid data",
        });
    }
    try {
        const { name, email, password } = parsedData.data;
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUser) {
            return res.status(401).json({
                message: "User already exists",
            });
        }
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
            },
        });
        return res.status(200).json({
            message: "User created successfully",
            user,
        });
    }
    catch (e) {
        console.error(e);
        return res.status(501).json({
            message: "User creation failed",
        });
    }
};
exports.signup = signup;
const signin = async (req, res) => {
    const parsedData = Validation_1.signinSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(401).json({
            message: "invalid user or password"
        });
    }
    try {
        const { email, password } = parsedData.data;
        const user = await prisma.user.findUnique({
            where: {
                email,
            }
        });
        if (!user) {
            return res.status(401).json({
                message: "user does not exit"
            });
        }
        const matched = await bcrypt.compare(password, user.passwordHash);
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });
        return res.status(200).json({
            message: "signup sucessfull",
            token
        });
    }
    catch (error) {
        return res.status(501).json({
            Messaage: "inbvalid details"
        });
    }
};
exports.signin = signin;
