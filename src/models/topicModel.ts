import mongoose from "mongoose";
const topicSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  level: { type: String, required: true },
  content: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
});

export const Topic = mongoose.model("Topic", topicSchema);
