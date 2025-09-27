"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Userroute_1 = __importDefault(require("./route/Userroute"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const Roomroute_1 = __importDefault(require("./route/Roomroute"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({
        msg: "hello"
    });
});
app.use('/api/v1/users', Userroute_1.default);
app.use('/api/v1/room', Roomroute_1.default);
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
