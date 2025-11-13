import express from "express"
import { createroom, getRoomsCreatedByUser } from "../controller/Roomcontroller";
import { authenticate } from "../middleware";
const Room=express.Router();

Room.post('/createromm',authenticate,createroom);

Room.get('/getRoomsCreatedByUser',authenticate,getRoomsCreatedByUser);
export default Room;