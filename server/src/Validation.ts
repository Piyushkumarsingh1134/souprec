import {z} from "zod";


export const signupSchema = z.object({
    name : z.string(),
    email : z.string().email(),
    password : z.string().min(4).max(18)
})



export const signinSchema = z.object({
    
    email : z.string().email(),
    password : z.string().min(4).max(18)
})


export const createRoomSchema=z.object({
    roomCode:z.string().max(50),
    title:z.string(),
    description:z.string(),
    isLive:z.boolean().default(false),
});


