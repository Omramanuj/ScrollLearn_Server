"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContent = void 0;
const topicModel_1 = require("../models/topicModel");
const cardModel_1 = require("../models/cardModel");
const llmService_1 = require("../services/llmService");
const generateContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { topic, level, description } = req.body;
    if (!topic || !level) {
        return res.status(400).json({ error: "Topic and level are required" });
    }
    try {
        // let existingTopic = await Topic.findOne({ topic, level }).populate("content");
        // if (existingTopic) {
        //   console.log("Topic found in DB. Returning existing content.");
        //   return res.status(200).json(existingTopic);
        // }
        let content = yield (0, llmService_1.generateEducationalContent)(topic, level, description);
        if (!content) {
            return res.status(500);
        }
        // console.log("content type : ",typeof content);
        console.log("content : ", content);
        let parsedContent;
        try {
            parsedContent = JSON.parse(content);
            console.log("Parsed content succesfully \n");
        }
        catch (error) {
            console.error("Error parsing JSON:", error, content);
            return res.status(500).json({ error: "Invalid JSON from AI response" });
        }
        if (!parsedContent.content || !Array.isArray(parsedContent.content)) {
            return res.status(500).json({ error: "Invalid content format" });
        }
        let cardDocuments;
        try {
            console.log("Attempting to insert cards into DB...");
            cardDocuments = yield cardModel_1.Card.insertMany(parsedContent.content.map((card) => ({
                title: card.title,
                htmlContent: card.htmlContent,
            })));
            console.log("Cards inserted successfully:", cardDocuments.length);
        }
        catch (err) {
            console.error("Error while inserting cards:", err);
            return res.status(500).json({ error: "Failed to insert cards into DB" });
        }
        const cardIds = cardDocuments.map((card) => card._id);
        console.log("Card IDs saved:", cardIds);
        const newTopic = new topicModel_1.Topic({
            topic: parsedContent.topic,
            level: parsedContent.level,
            content: cardDocuments.map((card) => card._id),
        });
        yield newTopic.save();
        console.log("New topic saved to DB:", newTopic);
        return res.status(201).json(newTopic);
    }
    catch (error) {
        return res.status(500);
    }
});
exports.generateContent = generateContent;
