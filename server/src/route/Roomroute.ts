import express from "express"
import { createroom } from "../controller/Roomcontroller";
import { authenticate } from "../middleware";
const Room=express.Router();

Room.post('/createromm',authenticate,createroom);


export default Room;