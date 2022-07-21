import mongoose from "mongoose";

const GameSchema = new mongoose.Schema(
  {
    gameId: { type: String, required: true },
    player1: {
      id: { type: String, required: [true, "Challenger id is required"] },
      played: { type: Boolean, default: false, required: true },
      timestamp: { type: String },
      input: { type: String },
    },
    player2: {
      id: { type: String },
      played: { type: Boolean, default: false, required: true },
      timestamp: { type: String },
      input: { type: String },
    },
    word: { type: String },
    status: { type: String, required: true, default: "ongoing" },
  },
  { timestamps: true }
);

export default mongoose.model("Game", GameSchema);
