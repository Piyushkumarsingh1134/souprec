import express, { Request, Response } from "express";
import User from "./route/Userroute";
import cors from 'cors';
import { PrismaClient } from "@prisma/client";
import Room from "./route/Roomroute";
const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    msg: "hello"
  });
});

app.use('/api/v1/users', User);
app.use('/api/v1/room',Room);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
