// controllers/chatController.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🎯 ADD CONVERSATION MEMORY BACK
const conversationMemory = new Map();

// controllers/chatController.js
export const chatController = {
  async chatWithAI(req, res) {
    try {
      const { message, conversationId } = req.body;

      let conversation = conversationMemory.get(conversationId) || [];

      const conversationHistory = conversation
        .slice(-6) // Last 3 exchanges
        .map((entry) => `${entry.role}: ${entry.content}`)
        .join("\n");

      if (!message) {
        return res.status(400).json({
          success: false,
          message: "Message is required",
        });
      }

      console.log("🤖 User message:", message);

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // 🎯 NEW PROMPT FOR STRUCTURED RESPONSES
      const prompt = `
You are Sugoyage, a Cebu travel expert.

Previous conversation:
${conversationHistory || "No previous conversation"}

Current question: ${message}

IF the user is asking for a trip plan/itinerary, return EXACTLY in this JSON format:
{
  "type": "trip_plan",
  "data": {
    "title": "Creative Trip Title",
    "duration": {"days": number, "nights": number},
    "budget": {"total": "₱X,XXX"},
    "days": [
      {
        "dayNumber": 1,
        "theme": "Day Theme",
        "activities": [
          {
            "name": "Activity Name",
            "time": "9:00 AM",
            "duration": "1 hour",
            "cost": "Free or ₱XXX",
            "category": "cultural/adventure/beach/food/historical/nature"
          }
        ]
      }
    ]
  },
  "message": "Friendly success message with emojis"
}

IF it's just a simple question, respond with normal text.

Examples:
- "Plan 3-day trip" → RETURN JSON
- "Best beaches?" → NORMAL TEXT
- "Magellan's Cross hours?" → NORMAL TEXT

User request: ${message}

Respond accordingly:
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      conversation.push(
        { role: "user", content: message },
        { role: "assistant", content: text }
      );

      if (conversation.length > 10) {
        conversation = conversation.slice(-10);
      }

      conversationMemory.set(conversationId, conversation);

      console.log("✅ Raw AI response:", text);

      // 🎯 TRY TO PARSE AS STRUCTURED TRIP PLAN
      let responseData;
      try {
        // 🎯 CLEAN THE RESPONSE - Remove backticks and "json"
        let cleanedText = text;
        if (cleanedText.includes("```json")) {
          cleanedText = cleanedText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
        }

        responseData = JSON.parse(cleanedText);
        console.log("🎯 Structured trip plan detected!");
      } catch (error) {
        // If not JSON, it's normal chat
        responseData = {
          type: "chat",
          message: text,
        };
        console.log("💬 Normal chat response");
      }
      res.json({
        success: true,
        ...responseData,
        conversationId: conversationId, // 🎯 ADD THIS
      });
    } catch (error) {
      console.error("❌ Chat error:", error);
      res.status(500).json({
        success: false,
        message: "Error chatting with AI",
        error: error.message,
      });
    }
  },
};
