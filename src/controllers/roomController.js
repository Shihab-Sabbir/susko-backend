import { createRoom, joinRoom, submitAnswer, startGame, sendMessage, getRoomById } from "../services/roomService.js";

export const createRoomController = async (req, res) => {
    console.log('req : ', req.body);
    try {
        const { categories, timerDuration, leaderName } = req.body;
        const room = await createRoom({ categories, timerDuration, leaderName });
        res.json({ room });
    } catch (error) {
        console.error("Error while creating room:", error);  // Log the error
        res.status(500).json({ error: "Failed to create room", details: error.message });  // Return error message
    }
};


export const joinRoomController = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { name, teamId } = req.body;
        const updatedRoom = await joinRoom(roomId, name, teamId);
        res.json({ success: true, room: updatedRoom });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const submitAnswerController = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { playerName, answer, questionId } = req.body;
        const room = await submitAnswer(roomId, { playerName, answer, questionId });
        res.json({ success: true, room });
    } catch (error) {
        console.log('error : ', error)
        res.status(500).json({ error: "Failed to submit answer" });
    }
};

export const startGameController = async (req, res) => {
    try {
        const { roomId } = req.params;
        await startGame(roomId);
        res.json({ success: true });
    } catch (error) {
        console.error("Start game error:", error);
        res.status(500).json({ error: "Failed to start game" });
    }
};

export const sendMessageController = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { playerName, message } = req.body;

        const room = await sendMessage(roomId, { playerName, message });

        // Send success response
        res.json({ success: true, room });
    } catch (error) {
        console.error("Message sending error:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
};

export const getRoomByIdController = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await getRoomById(roomId);

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        res.json({ success: true, room });
    } catch (error) {
        console.error("Error fetching room:", error);
        res.status(500).json({ error: "Failed to fetch room" });
    }
};
