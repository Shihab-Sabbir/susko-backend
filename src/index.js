import express from "express";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import roomRoutes from "./routes/roomRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const corsOptions = {
  origin: "http://localhost:3001",
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions));

app.use(express.json());


io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


app.set("io", io);


app.use("/api/v1", roomRoutes);


const mongoUri = process.env.MONGODB_URI;
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
