import express from "express"
import { createroom, getRoomDetails, getRoomsCreatedByUser } from "../controller/Roomcontroller";
import { authenticate } from "../middleware";
const Room=express.Router();

Room.post('/createromm',authenticate,createroom);

Room.get('/getRoomsCreatedByUser',authenticate,getRoomsCreatedByUser);

Room.get('/getRoomDetails', authenticate, getRoomDetails);

export default Room;