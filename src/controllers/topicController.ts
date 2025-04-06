import { Request, Response } from "express";
import { Topic } from "../models/topicModel";
import { Card } from "../models/cardModel";


export const getAllTopics = async (req: Request, res: Response): Promise<any> => {
  try {
    // Fetch all topics and populate the associated cards
    const topics = await Topic.find().populate("content");

    if (!topics || topics.length === 0) {
      return res.status(404).json({ error: "No topics found" });
    }

    return res.status(200).json(topics);
  } catch (error) {
    console.error("Error fetching topics and cards:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getTopicWithCards = async (req: Request, res: Response): Promise<any> => {
    const { topicId } = req.params; // Get the topic ID from the request parameters
  
    try {
      // Find the topic by ID
      const topic = await Topic.findById(topicId);
  
      if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
      }
  
      // Iterate through the ObjectIds in the content array
      const cardIds = topic.content; // Array of ObjectIds
      const cards = await Card.find({ _id: { $in: cardIds } }); // Fetch all cards with these ObjectIds
  
      if (!cards || cards.length === 0) {
        return res.status(404).json({ error: "No cards found for this topic" });
      }
  
      // Return the topic along with its cards
      return res.status(200).json({
        topic: {
          _id: topic._id,
          topic: topic.topic,
          level: topic.level,
        },
        cards,
      });
    } catch (error) {
      console.error("Error fetching topic with cards:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };