import { io } from "../index.js";
import { Room } from "../model/room.js";
import { calculateScores } from "../utils/calculateScores.js";
import { emitGameStateUpdate } from "../utils/emitGameStateUpdate.js";
import { sampleQuizzes } from "../quizzes/sample-quizzes.js";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { startGameTimer } from "../utils/startGameTimer.js";

const generateRoomId = () => uuidv4().substring(0, 6).toUpperCase();

const selectQuizzesByCategories = (categories) => {
  let selectedQuizzes = [];
  categories.forEach((category) => {
    if (sampleQuizzes[category]) {
      const shuffled = [...sampleQuizzes[category]].sort(() => Math.random() - 0.5);
      selectedQuizzes = [...selectedQuizzes, ...shuffled.slice(0, 3)];
    }
  });
  return selectedQuizzes.sort(() => Math.random() - 0.5);
};

export const createRoom = async ({ categories, timerDuration, leaderName }) => {
  const roomId = generateRoomId();
  const selectedQuizzes = selectQuizzesByCategories(categories);
  if (selectedQuizzes.length === 0) throw new Error("No questions available for selected categories");

  const room = new Room({
    id: roomId,
    quiz: selectedQuizzes,
    categories,
    timerDuration: timerDuration || 20,
    players: [{ name: leaderName, role: "leader" }],
    teams: {
      red: { players: [], score: 0, answers: [] },
      blue: { players: [], score: 0, answers: [] },
      green: { players: [], score: 0, answers: [] },
      yellow: { players: [], score: 0, answers: [] },
    },
    status: "waiting",
    currentQuestionIndex: 0,
    messages: [
      {
        type: "system",
        text: `Room created by ${leaderName} at ${moment().format("YYYY-MM-DD HH:mm:ss")}`,
        player: { name: leaderName, team: "leader" },
        timestamp: moment().toISOString(),
      },
    ],
    timeLeft: timerDuration || 20,
    startTime: null,
    quizStarted: false,
  });

  await room.save();
  emitGameStateUpdate(room);
  return room;
};

export const joinRoom = async (roomId, name, teamId) => {
  const room = await Room.findOne({ id: roomId });
  if (!room) throw new Error("Room not found");
  if (room.members.find((m) => m.name === name)) throw new Error("Player name already taken");
  if (room.quizStarted) throw new Error("Cannot join. The game has already started.");

  room.members.push({ name, teamId });
  if (!room.teams) room.teams = [];

  let team = room.teams.find((t) => t.color === teamId);
  if (!team) {
    team = { id: teamId, color: teamId, players: [{ name, teamId }], score: 0 };
    room.teams.push(team);
  } else {
    team.players.push({ name, teamId });
  }

  room.messages.push({
    type: "system",
    text: `${name} has joined the room as ${teamId} team.`,
    player: { name, team: teamId },
    timestamp: moment().toISOString(),
  });

  await room.save();
  emitGameStateUpdate(room);
  return room;
};

export const submitAnswer = async (roomId, { playerName, answer, questionId }) => {
  const room = await Room.findOne({ id: roomId });
  if (!room) throw new Error("Room not found");
  if (!room.answers) room.answers = new Map();

  const answerKey = `${playerName}_${questionId}`;
  if (room.answers.has(answerKey)) throw new Error("Player has already answered this question");

  const question = room.quiz.find((q) => q._id.toString() === questionId.toString());
  if (!question) throw new Error("Question not found");

  const isCorrect = question.options[question.correctAnswer] === answer;
  const player = room.members.find((member) => member.name === playerName);
  if (!player) throw new Error("Player not found in room members");

  const teamColor = player.teamId;
  if (isCorrect) {
    const teamIndex = room.teams.findIndex((t) => t.color === teamColor);
    if (teamIndex >= 0) room.teams[teamIndex].score += question.points;
  }

  room.answers.set(answerKey, answer);
  room.submitAnswerActive = false;
  await room.markModified("teams");
  await room.save();
  emitGameStateUpdate(room);
  return room;
};

export const endGame = async (room) => {
  try {
    const winners = calculateWinners(room);
    await Room.findByIdAndUpdate(room._id, { status: "completed", winners });

    setTimeout(async () => {
      await Room.findByIdAndDelete(room._id);
      io.to(room.id).emit("roomClosed", { message: "Room has been closed" });
    }, 60000);

    return { ...room, status: "completed", winners };
  } catch (error) {
    throw new Error("Failed to end game");
  }
};

export const startGame = async (roomId) => {
  try {
    const room = await getRoomById(roomId);
    if (!room) throw new Error("Room not found");
    if (room.status === "in-progress") throw new Error("Game already in progress");

    room.status = "in-progress";
    room.quizStarted = true;
    room.currentQuestionIndex = 0;
    room.startTime = Date.now();

    Object.values(room.teams).forEach((team) => {
      team.currentAnswer = null;
      team.score = 0;
    });

    await startGameTimer(room, {
      onGameEnd: async (gameRoom) => await endGame(gameRoom),
      onStateUpdate: async (updatedRoom) => {
        await Room.findOneAndUpdate({ id: updatedRoom.id }, updatedRoom, { new: true });
        io.emit("gameState", updatedRoom);
      },
    });

    await Room.findOneAndUpdate({ id: room.id }, room, { new: true });
    return room;
  } catch (error) {
    throw new Error("Failed to start game");
  }
};

const calculateWinners = (room) => {
  const scores = Object.entries(room.teams)
    .map(([teamId, team]) => ({ teamId, score: team.score }))
    .sort((a, b) => b.score - a.score);

  const highestScore = scores[0].score;
  return scores.filter((team) => team.score === highestScore).map((team) => team.teamId);
};

export const sendMessage = async (roomId, { playerName, message }) => {
  const room = await Room.findOne({ id: roomId });
  if (!room) throw new Error("Room not found");

  const playerExists = room.members.some((player) => player.name === playerName);
  if (!playerExists && playerName !== "Room Leader") throw new Error("Player not found in room");

  if (!room.messages) room.messages = [];
  room.messages.push({
    type: "user",
    text: message,
    player: { name: playerName, team: "Leader" },
    timestamp: moment().toISOString(),
  });

  await room.save();
  io.to(roomId).emit("gameState", room);
  emitGameStateUpdate(room);
  return room;
};

export const getRoomById = async (roomId) => {
  try {
    const room = await Room.findOne({ id: roomId });
    if (!room) return null;
    return room;
  } catch (error) {
    throw new Error("Failed to fetch room");
  }
};
