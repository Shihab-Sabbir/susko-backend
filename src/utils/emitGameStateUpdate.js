import { io } from "../index.js";

export const emitGameStateUpdate = (room) => {
    if (!room || !room.id) return;
    const gameState = {
        id: room.id,
        members: room.members || [],
        messages: room.messages || [],
        quiz: room.quiz || [],
        quizStarted: room.quizStarted || false,
        currentQuestionIndex: room.currentQuestionIndex || 0,
        answers: room.answers || new Map(),
        correctAnswers: room.correctAnswers || new Map(),
        timerDuration: room.timerDuration || 0,
        timeLeft: room.timeLeft || 0,
        leaderId: room.leaderId || null,
        teams: room.teams || [],
        status: room.status || "waiting",
        scores: room.scores,
    };

    io.emit("gameState", gameState);
};
