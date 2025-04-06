import express from "express";
import { generateContent } from "../controllers/contentController";
import { getAllTopics, getTopicWithCards } from "../controllers/topicController";

const router = express.Router();

router.post("/request", generateContent); 
router.get("/topics",getAllTopics);
router.get("/topics-content/:topicId", getTopicWithCards); 

export default router;
