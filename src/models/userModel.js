"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    auth_provider: { type: String, required: true }, // e.g., "google", "local"
    progress: [
        {
            topic_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Topic" },
            completed_cards: [Number],
        },
    ],
});
exports.User = mongoose_1.default.model("User", userSchema);
