"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const topicSchema = new mongoose_1.default.Schema({
    topic: { type: String, required: true },
    level: { type: String, required: true },
    content: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Card" }],
});
exports.Topic = mongoose_1.default.model("Topic", topicSchema);
