import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    id: String,
    members: [
        {
            name: String,
            teamId: String,
        },
    ],
    messages: [{
        type: { type: String, required: true },
        text: { type: String, required: true },
        player: { name: String, team: String },
        timestamp: { type: Date, default: Date.now },
    }],
    quiz: [
        {
            text: String,
            options: [String],
            correctAnswer: Number,
            category: String,
            points: Number,
        },
    ],
    quizStarted: Boolean,
    submitAnswerActive: Boolean,
    currentQuestionIndex: Number,
    answers: Map,
    correctAnswers: Map,
    timerDuration: Number,
    timeLeft: Number,
    leaderId: String,
    teams: [
        {
            id: String,
            color: String,
            players: [
                {
                    id: String,
                    name: String,
                    teamId: String,
                },
            ],
            score: Number,
        },
    ],
    status: String,
    scores: {
    type: [
        {
            type: Map,
            of: Number,
        },
    ],
    default: [
        { red: 0 },
        { blue: 0 },
        { green: 0 },
        { yellow: 0 },
    ],
},

});

export const Room = mongoose.model("Room", RoomSchema);
