
import { endGame } from "../services/roomService.js";
import { emitGameStateUpdate } from "./emitGameStateUpdate.js";

export const startGameTimer = async (room) => {
    if (!room || !room.id) return;

    // Clear any existing timer
    if (room.timerInterval) {
        clearInterval(room.timerInterval);
    }

    // Initialize timer and start time
    room.timeLeft = room.timerDuration || 20;
    room.startTime = Date.now();

    // Emit initial game state
    emitGameStateUpdate(room);

    const handleNextQuestion = async () => {
        // Check if more questions are available
        if (room.currentQuestionIndex < room.quiz.length - 1) {
            // Wait 3 seconds before moving to the next question
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Reset team answers for the next question
            Object.values(room.teams).forEach(team => {
                team.currentAnswer = null;
            });

            // Increment question index and reset the timer
            room.currentQuestionIndex += 1;
            room.timeLeft = room.timerDuration;
            room.startTime = Date.now();
            room.submitAnswerActive=true;
            // Emit game state update for the new question
            emitGameStateUpdate(room);

            // Start timer for the next question
            startGameTimer(room);
        } else {
            // End the game if no questions are left
            room.status = "completed";
            await endGame(room);
            emitGameStateUpdate(room);
        }
    };

    // Timer interval logic
    room.timerInterval = setInterval(async () => {
        room.timeLeft -= 1;

        // Update game state for the current tick
        emitGameStateUpdate(room);

        if (room.timeLeft <= 0) {
            clearInterval(room.timerInterval);

            // Update room for the end of the current question
            Object.values(room.teams).forEach(team => {
                team.currentAnswer = null;
            });

            // Handle the next question or end the game
            await handleNextQuestion();
        }
    }, 1000);

    return room.timerInterval;
};
