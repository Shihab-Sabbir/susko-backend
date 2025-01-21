import { Room } from "../models/Room";
import { io } from "../index.js";


export const startGameTimer = async (roomId) => {
    const room = await Room.findById(roomId);
    if (!room) {
        throw new Error("Room not found");
    }

    const interval = setInterval(async () => {
        if (room.timeLeft <= 0) {
            clearInterval(interval);

            room.status = "completed";
            await room.save();

            io.to(roomId).emit("gameState", room);
            return;
        }

        room.timeLeft -= 1;
        await room.save();


        io.to(roomId).emit("gameState", { timeLeft: room.timeLeft });
    }, 1000);
};
