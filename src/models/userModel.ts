import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  auth_provider: { type: String, required: true }, // e.g., "google", "local"
  progress: [
    {
      topic_id: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
      completed_cards: [Number],
    },
  ],
});

export const User = mongoose.model("User", userSchema);
