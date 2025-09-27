"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoomSchema = exports.signinSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(4).max(18)
});
exports.signinSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(4).max(18)
});
exports.createRoomSchema = zod_1.z.object({
    roomCode: zod_1.z.string().max(50),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    isLive: zod_1.z.boolean().default(false),
});
