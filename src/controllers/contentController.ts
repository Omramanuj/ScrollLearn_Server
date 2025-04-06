import { Request, Response } from "express";
import { Topic }  from "../models/topicModel";
import { Card } from "../models/cardModel";
import { generateEducationalContent } from "../services/llmService";

export const generateContent = async (req: Request, res: Response):Promise<any> => {
  const { topic, level,description } = req.body;

  if (!topic || !level) {
    return res.status(400).json({ error: "Topic and level are required" });
  }

  try {
    // let existingTopic = await Topic.findOne({ topic, level }).populate("content");

    // if (existingTopic) {
    //   console.log("Topic found in DB. Returning existing content.");
    //   return res.status(200).json(existingTopic);
    // }

    let content = await generateEducationalContent(topic, level,description);
    if (!content) {
      return res.status(500);
    }
    // console.log("content type : ",typeof content);
     console.log("content : ",content);
    
     let parsedContent;
     try {
       parsedContent = JSON.parse(content);
       console.log("Parsed content succesfully \n" );
     } catch (error) {
       console.error("Error parsing JSON:", error, content);
       return res.status(500).json({ error: "Invalid JSON from AI response" });
     }
     if (!parsedContent.content || !Array.isArray(parsedContent.content)) {
      return res.status(500).json({ error: "Invalid content format" });
    }
    
    let cardDocuments;
    try {
      console.log("Attempting to insert cards into DB...");
       cardDocuments = await Card.insertMany(
        parsedContent.content.map((card: { title: string; htmlContent: string }) => ({
          title: card.title,
          htmlContent: card.htmlContent,
        }))
      );
      console.log("Cards inserted successfully:", cardDocuments.length);
    } catch (err) {
      console.error("Error while inserting cards:", err);
      return res.status(500).json({ error: "Failed to insert cards into DB" });
    }
    
    const cardIds = cardDocuments.map((card) => card._id);
    console.log("Card IDs saved:", cardIds);
    
    const newTopic = new Topic({
      topic:parsedContent.topic,
      level: parsedContent.level,
      content: cardDocuments.map((card) => card._id),
    })
    await newTopic.save();
    console.log("New topic saved to DB:", newTopic);
    return res.status(201).json(newTopic); 
  } catch (error) {
    return res.status(500);
  }
};