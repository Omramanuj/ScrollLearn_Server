"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contentController_1 = require("../controllers/contentController");
const topicController_1 = require("../controllers/topicController");
const router = express_1.default.Router();
router.post("/request", contentController_1.generateContent);
router.get("/topics", topicController_1.getAllTopics);
router.get("/topics-content/:topicId", topicController_1.getTopicWithCards);
exports.default = router;
