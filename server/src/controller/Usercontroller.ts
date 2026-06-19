import express, { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { signinSchema, signupSchema } from "../Validation";
import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  const parsedData = signupSchema.safeParse(req.body);



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

    const token = jwt.sign({ userId: user.id }, JWT_SECRET as string, { expiresIn: "1d" });

    return res.status(200).json({
      message: "User created successfully",
      user,
      token,
    });
  } catch (e) {
    console.error(e);
    return res.status(501).json({
      message: "User creation failed",
    });
  }
};




export const signin=async(req:Request,res:Response)=>{
  const parsedData=signinSchema.safeParse(req.body);

  if(!parsedData.success){
    return res.status(401).json({
      message:"invalid user or password"
    })
  }
  try {
    const { email,password } = parsedData.data;

     const user=await prisma.user.findUnique({
    where:{
        email,
    }
   });

   if(!user){
     return res.status(401).json({
       message:"user does not exit"
     })
   }
   const matched=await bcrypt.compare(password,user.passwordHash);
  const token=jwt.sign({userId:user.id}, JWT_SECRET as string,{ expiresIn: "1d" });
  return res.status(200).json({
     message:"signup sucessfull",
     token
  })

  } catch (error) {
    return res.status(501).json({
       Messaage:"inbvalid details"
    })
  }


}

