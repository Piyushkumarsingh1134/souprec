"use strict";
// import express, { Request, Response } from "express";
// import User from "./route/Userroute";
// import cors from 'cors';
// import { PrismaClient } from "@prisma/client";
// import Room from "./route/Roomroute";
// const prisma = new PrismaClient();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const app = express();
// const server = createServer(app);
// app.use(cors());
// app.use(express.json());
// app.get("/", (req: Request, res: Response) => {
//   res.json({
//     msg: "hello"
//   });
// });
// app.use('/api/v1/users', User);
// app.use('/api/v1/room',Room);
// app.listen(3000, () => {
//   console.log("Server is running on http://localhost:3000");
// });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const Userroute_1 = __importDefault(require("./route/Userroute"));
const Roomroute_1 = __importDefault(require("./route/Roomroute"));
const http_1 = require("http");
const signalling_1 = require("./signalling");
const Upload_1 = __importDefault(require("./route/Upload"));
const Recording_1 = __importDefault(require("./route/Recording"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({ msg: "hello" });
});
app.use("/api/v1/users", Userroute_1.default);
app.use("/api/v1/room", Roomroute_1.default);
app.use("/api/v1/recording", Recording_1.default);
app.use("/api/v1/upload", Upload_1.default);
// Initialize WebSocket signaling (shared on same server)
(0, signalling_1.setupSignaling)(server);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
