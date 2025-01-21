import express from "express";

import {
    createRoomController,
    joinRoomController,
    submitAnswerController,
    startGameController,
    sendMessageController,
    getRoomByIdController
} from "../controllers/roomController.js";


const routers = express.Router();

routers.get("/rooms/:roomId", getRoomByIdController);

routers.post("/rooms", createRoomController);
routers.post("/rooms/:roomId/join", joinRoomController);
routers.post("/rooms/:roomId/answer", submitAnswerController);
routers.post("/rooms/:roomId/start", startGameController);
routers.post("/rooms/:roomId/message", sendMessageController);

export default routers;
