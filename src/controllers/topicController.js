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
exports.getTopicWithCards = exports.getAllTopics = void 0;
const topicModel_1 = require("../models/topicModel");
const mongodb_1 = require("mongodb");
const getAllTopics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all topics and populate the associated cards
        const topics = yield topicModel_1.Topic.find();
        if (!topics || topics.length === 0) {
            return res.status(404).json({ error: "No topics found" });
        }
        return res.status(200).json(topics);
    }
    catch (error) {
        console.error("Error fetching topics and cards:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllTopics = getAllTopics;
const getTopicWithCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { topicId } = req.params; // Get the topic ID from the request parameters
    const objectId = new mongodb_1.ObjectId(topicId);
    try {
        // Find the topic by ID
        const topic = yield topicModel_1.Topic.findById(objectId).populate("content");
        if (!topic) {
            return res.status(404).json({ error: "Topic not found" });
        }
        // Iterate through the ObjectIds in the content array
        // const cardIds = topic.; // Array of ObjectIds
        // const cards = await Card.find({ _id: { $in: cardIds } }); // Fetch all cards with these ObjectIds
        // if (!cards || cards.length === 0) {
        //   return res.status(404).json({ error: "No cards found for this topic" });
        // }
        console.log(topic);
        // Return the topic along with its cards
        return res.status(200).json(topic
        //   {
        //   // topic: {
        //   //   _id: topic._id,
        //   //   topic: topic.topic,
        //   //   level: topic.level,
        //   // },
        //   // cards,
        // }
        );
    }
    catch (error) {
        console.error("Error fetching topic with cards:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getTopicWithCards = getTopicWithCards;
