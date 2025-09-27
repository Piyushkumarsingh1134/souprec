"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Usercontroller_1 = require("../controller/Usercontroller");
const User = express_1.default.Router();
// user.post('/signin',);
User.post('/signup', Usercontroller_1.signup);
User.post('/signin', Usercontroller_1.signin);
exports.default = User;
