import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  htmlContent: { type: String, required: true }
});

export const Card = mongoose.model("Card", cardSchema);
