"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Roomcontroller_1 = require("../controller/Roomcontroller");
const middleware_1 = require("../middleware");
const Room = express_1.default.Router();
Room.post('/createromm', middleware_1.authenticate, Roomcontroller_1.createroom);
Room.get('/getRoomsCreatedByUser', middleware_1.authenticate, Roomcontroller_1.getRoomsCreatedByUser);
Room.get('/getRoomDetails', middleware_1.authenticate, Roomcontroller_1.getRoomDetails);
exports.default = Room;
