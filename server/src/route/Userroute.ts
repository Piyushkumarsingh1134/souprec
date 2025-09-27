import express from "express"
import { signin, signup } from "../controller/Usercontroller";
const User=express.Router();

// user.post('/signin',);

User.post('/signup',signup );

User.post('/signin',signin);


export default User;
