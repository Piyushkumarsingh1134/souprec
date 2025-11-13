// import express, { Request, Response } from "express";
// import User from "./route/Userroute";
// import cors from 'cors';
// import { PrismaClient } from "@prisma/client";
// import Room from "./route/Roomroute";
// const prisma = new PrismaClient();

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

import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import User from "./route/Userroute";
import Room from "./route/Roomroute";
import { createServer } from "http";
import { setupSignaling } from "./signalling"; // 👈 import signaling setup
import Upload from "./route/Upload";

const prisma = new PrismaClient();
const app = express();
const server = createServer(app); // shared HTTP + WS server

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ msg: "hello" });
});

app.use("/api/v1/users", User);
app.use("/api/v1/room", Room);
app.use("/api/v1/upload",Upload);

// Initialize WebSocket signaling (shared on same server)
setupSignaling(server);

server.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
