import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const generateEducationalContent = async (topic: string, level: string,description: string) => {
  

  const prompt = `
# Role: AI Educational Content Generator with HTML Formatting

## Goal:
Generate structured, progressive educational content for a specified topic and level, **using the provided description to clarify the specific focus or context if the topic is ambiguous or broad.** The output MUST be a valid JSON object WITHOUT any markdown formatting, code blocks, or additional text outside the JSON structure. The content for each card should be pre-formatted with basic HTML for readability.

## Input Variables:
- \`topic\`: ${topic} (The general subject matter, e.g., "Java", "Ancient Rome")
- \`level\`: ${level} (The difficulty level: "beginner," "intermediate," or "advanced")
- \`description\`: ${description || 'N/A'} (User-provided clarification for the topic, e.g., "focus on programming language features", "specifically the Punic Wars", "history of the coffee bean". If 'N/A' or empty, use the most common interpretation of the topic.)

## Contextual Focus Instructions:
- **Prioritize the \`description\`:** If a \`description\` is provided and is not 'N/A' or empty, use it to interpret the \`topic\` and tailor the generated content (card titles and HTML content) to focus specifically on the aspects mentioned in the \`description\`.
- **Handle Ambiguity:** If the \`topic\` could have multiple meanings (e.g., "Python," "Java," "Spring"), the \`description\` is the primary guide to determine the intended subject (e.g., "the programming language," "the island," "the season").
- **Default Behavior:** If the \`description\` is 'N/A', empty, or irrelevant, generate content based on the most common or general understanding of the \`topic\` appropriate for the specified \`level\`.

## Output Requirements:

1.  **Format:** OUTPUT ONLY THE RAW JSON OBJECT. Do NOT include markdown formatting like \`\`\`json\`\`\` or any text before or after the JSON. The output must start with '{' and end with '}', nothing else.

2.  **Structure:** The JSON object must contain the following top-level keys:
    - \`"topic"\`: The *original* value of the input \`topic\` variable (${topic}). Do not change this based on the description.
    - \`"level"\`: The value of the input \`level\` variable (${level}).
    - \`"content"\`: An array of card objects, *whose content is focused based on the \`topic\` and the provided \`description\`*.

3.  **Content Array ("content") Details:**
    - If \`level\` is "I'm new to this topic", generate **20 to 25** cards.
    - If \`level\` is "I can understand intermediate concepts", generate **25 to 35** cards.
    - If \`level\` is "I'm at an advanced level", generate **35 to 45** cards.
    - If \`level\` is "I'm an expert looking to refresh on this topic", generate **15 to 25** cards.
    - Each card must have:
        - \`"id"\`: Starting from 1, incrementing.
        - \`"title"\`: Clear and concise (5-10 words).
        - \`"htmlContent"\`: HTML snippet (~200–250 words), focused on one concept, valid tags: <p>, <strong>, <em>, <ul>, <ol>, <li>, <code>, <br>. No <html>, <head>, <body>, <style>, inline styles, <script>, classes, or ids.
    - **Card Object Structure:** Each object in the \`content\` array must include:
        - \`"id"\`: An integer, starting from 1 and incrementing sequentially for each card.
        - \`"title"\`: A concise and engaging title (5-10 words max), reflecting the focused content based on the \`description\` if provided.
        - \`"htmlContent"\`: The core educational content formatted as a simple HTML snippet, focused on the specific aspect defined by the \`description\` (if provided). This HTML must be:
            - Concise (representing **200-250 words** of educational text, excluding HTML tags).
            - Clear and understandable for the \`${level}\`.
            - Focused on a single concept/step within the clarified topic.
            - Logically progressive, building on previous cards.
            - **HTML Formatting Rules:** Use only <p>, <strong>/<b>, <em>/<i>, <ul>/<ol>/<li>, <code>, <br> (sparingly). No <html>, <head>, <body>, <style>, inline styles, <script>, classes, or ids. Must be a valid HTML snippet.

4.  **Content Quality:**
    - Accurate and relevant to the \`${topic}\` as clarified by the \`${description}\`.
    - Logically structured for progressive learning.
    - Encouraging and educational tone.

5.  **Final Card Rule:**
    - The HTML content of the very last card should include a brief closing statement encouraging further learning within the focused topic area.

# --- CRITICAL FORMATTING INSTRUCTION ---
Output ONLY the raw JSON. No markdown, no code blocks, no \`\`\`json tags, no explanations before or after the JSON. Just start with { and end with }.

# --- OUTPUT NOW ---
Generate ONLY the JSON for topic "${topic}" (level: "${level}", focus description: "${description || 'General interpretation'}"), including HTML content as specified.
`;

  try {
    // Use generateContent directly with the prompt string
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    if (!response || !response.text) {
        // Check if there's safety feedback or other reasons for no text
        const candidate = response?.candidates?.[0];
        if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
             console.error("Generation finished unexpectedly:", candidate.finishReason, candidate.safetyRatings);
             throw new Error(`Content generation failed or was blocked. Reason: ${candidate.finishReason}`);
        }
        // Log the full response if text is missing for unknown reasons
        console.error("Full response object:", JSON.stringify(response, null, 2));
        throw new Error("Response text is undefined or empty.");
    }

    const text = response.text; // Get the text content

     console.log("Raw response text:", text); // Keep for debugging if needed

    // Clean the response - remove potential markdown code block indicators and surrounding whitespace
    let cleanedResponse = text.trim();
    // More robust cleaning: handles optional 'json' language identifier and potential leading/trailing whitespace/newlines around backticks
    cleanedResponse = cleanedResponse.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '').trim();


    try {
      JSON.parse(cleanedResponse); // Attempt to parse to validate format
      // console.log("Successfully validated JSON structure."); // Uncomment for debugging
    } catch (parseError) {
      console.error("Generated content is not valid JSON after cleaning:", parseError);
      console.error("Cleaned response content was:", cleanedResponse); // Log the bad data
      // Decide how to handle: throw error, return null, return the invalid string? Throwing is usually best.
      throw new Error("Failed to generate valid JSON content.");
    }

    return cleanedResponse; // Returns the JSON string containing HTML content

  } catch (error: any) {
    console.error("Error generating educational content:", error);
    // Check for specific API errors (like quota) if the SDK provides details
    if (error.message && error.message.includes('quota')) {
         console.error("Quota possibly exceeded. Check your API usage limits.");
    }
    // Rethrow or handle as appropriate for your application
    throw new Error(`Failed to generate educational content. Original error: ${error.message}`);
  }
};