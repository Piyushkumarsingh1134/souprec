import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { createRoomSchema } from "../Validation"


export const createroom=async(req:Request,res:Response)=>{
    const parsedData=createRoomSchema.safeParse(req.body);
    const hostId = (req as any).user.userId;

 if (!hostId) {
  return res.status(401).json({ message: "Unauthorized: missing hostId" });
}
     if (!parsedData.success) {
    return res.status(401).json({
      message: "Invalid data",
    });
  }


   try {
        const room=await prisma.room.create({
            data:{
                roomCode:parsedData.data.roomCode,
                title:parsedData.data.title,
                description:parsedData.data.description,
                isLive:parsedData.data.isLive,
                hostId:hostId
            },include:{
                host:true,
            }
        })

        res.status(201).json(room);
   } catch (err:any) {
    res.status(400).json({ error: err.message });
   }

}