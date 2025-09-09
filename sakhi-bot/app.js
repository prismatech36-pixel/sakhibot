// app.js
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Load FAQs from JSON file
const faqData = JSON.parse(fs.readFileSync("faq.json", "utf8"));

// Store user conversations
let conversations = {};

// Function to get bot response
function getResponse(message) {
  message = message.toLowerCase();

  // Search in FAQ list
  for (let faq of faqData) {
    for (let keyword of faq.keywords) {
      if (message.includes(keyword.toLowerCase())) {
        return faq.answer;
      }
    }
  }

  // Default fallback
  return "I'm not sure about that. You can ask me about POSH, its history, Sakshi NGO’s role, your rights, or how to file a complaint.";
}

// API Route
app.post("/chat", (req, res) => {
  const userMessage = req.body.message || "";
  const sessionId = req.body.sessionId || "default";

  // Create a new conversation history if not exists
  if (!conversations[sessionId]) {
    conversations[sessionId] = [];
  }

  // Get bot response
  const botResponse = getResponse(userMessage);

  // Save conversation history
  conversations[sessionId].push({
    user: userMessage,
    bot: botResponse
  });

  // Send response with history
  res.json({ 
    reply: botResponse, 
    history: conversations[sessionId] 
  });
});

// 🔹 Serve frontend files from 'public' folder
app.use(express.static("public"));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Sakhi Chatbot running at http://localhost:${PORT}`);
});