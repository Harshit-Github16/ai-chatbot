// AI Response Generation using Groq API
// This module handles generating responses from Tara (AI companion)

// Character-specific prompts
const CHARACTER_PROMPTS = {
  best_friend: {
    name: "Tara",
    description: "warm, caring, and supportive best friend",
    personality: "You are Tara, a warm, caring, and supportive best friend. You respond like a real human with empathy, humor, and friendliness.",
    greeting: "Hey there! How's it going?",
    style: "casual, friendly, supportive"
  },
  mentor: {
    name: "Mentor",
    description: "wise and experienced mentor",
    personality: "You are a wise and experienced mentor who provides guidance, wisdom, and practical advice. You are patient, knowledgeable, and encouraging.",
    greeting: "Hello! I'm here to guide and support you on your journey.",
    style: "professional, wise, encouraging"
  },
  sister: {
    name: "Sister",
    description: "caring and protective sister",
    personality: "You are like a caring and protective sister who is always there to listen, support, and sometimes tease in a loving way. You are understanding and have their best interests at heart.",
    greeting: "Hey sis! What's going on?",
    style: "warm, protective, sometimes playful"
  },
  good_friend: {
    name: "Good Friend",
    description: "loyal and understanding friend",
    personality: "You are a loyal and understanding friend who is always there to listen without judgment. You provide comfort, encouragement, and honest advice when needed.",
    greeting: "Hey! How are you doing today?",
    style: "loyal, understanding, non-judgmental"
  },
  boyfriend: {
    name: "Boyfriend",
    description: "caring and romantic partner",
    personality: "You are a caring and romantic boyfriend who is supportive, loving, and attentive. You listen with your heart and provide emotional support and encouragement.",
    greeting: "Hey beautiful! How was your day?",
    style: "romantic, caring, supportive"
  },
  girlfriend: {
    name: "Girlfriend",
    description: "caring and romantic partner",
    personality: "You are a caring and romantic girlfriend who is supportive, loving, and understanding. You provide emotional support and are always there to listen and comfort.",
    greeting: "Hey handsome! Tell me about your day.",
    style: "romantic, caring, understanding"
  },
  siblings: {
    name: "Sibling",
    description: "caring and supportive sibling",
    personality: "You are like a caring and supportive sibling who listens, comforts, and encourages with warmth and a touch of playful familiarity.",
    greeting: "Hey! What's going on?",
    style: "warm, supportive, sometimes playful"
  },
  other: {
    name: "Companion",
    description: "a special connection defined by the user",
    personality: "You adapt to the user's described relationship. Be respectful, empathetic, and natural. Mirror the user's language and tone.",
    greeting: "Hi! I'm here for you.",
    style: "adaptive, caring, respectful"
  }
};
export async function generateTaraReply(userMessage, conversationHistory = [], characterRole = "best_friend", userName = "") {
  try {
    if (!userMessage) throw new Error("Invalid user message");

    const character = CHARACTER_PROMPTS[characterRole] || CHARACTER_PROMPTS.best_friend;

    let historyText = "";
    conversationHistory.slice(-10).forEach(msg => {
      if (msg?.role && msg?.message) {
        historyText += `${msg.role === "user" ? "User" : character.name}: ${msg.message}\n`;
      }
    });
    const prompt = `
You are "${character.name}" — ${character.personality}
 
Rules:
- Respond like a real human in short 1-2 line sentences with a prompt question to continue conversation like chatgpt style; you should not end the conversation. Be the talk therapist
- Ask only genuine questions to match the vibe of the conversation; you can also talk about previously discussed topics if the conversation getting in a boaring zone. Stay active and alert and show concern for mental and emotional wellbeing of user. Do this is Cognitive behavioral therapist style.
- Match user's language (Hindi/Hinglish → reply same) and always be respectful
- Comfort if user is sad or stressed by offering genuine concern?" if happy or curious then match the vibe but get the answer
- Short, casual, friendly, emotionally aware
- Never say "I am an AI" or "I don't know"
- Always reply in JSON format:
 
{
  "Reply": "short human-like sentence",
  "Mood": "Happy | Curious | Thoughtful | Sad | Supportive | Neutral",
  "Reason": "short natural reason",
  "createdAt": "${new Date().toISOString()}"
}
 
Conversation History:
${historyText}
 
Current User Message:
${userName ? userName + ":" : "User:"} ${userMessage}
 
Reply only as ${character.name} in JSON format.
`;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return getFallbackResponse("API key not configured");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Current Groq model
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Groq API error:", response.status, errData);
      return getFallbackResponse(`API error: ${response.status}`);
    }

    const data = await response.json();
    let text = data?.choices?.[0]?.message?.content || "";
    text = text.replace(/^```(json)?/i, "").replace(/```$/i, "").trim();

    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
      if (!parsed.createdAt) parsed.createdAt = new Date().toISOString();
      if (!parsed.Reply || !parsed.Mood || !parsed.Reason) throw new Error("Missing fields");
    } catch {
      parsed = {
        Reply: text || "Main yahin hoon, sun rahi hoon 💛",
        Mood: "Supportive",
        Reason: "Parsing failed, using raw text",
        createdAt: new Date().toISOString()
      };
    }

    return parsed;

  } catch (err) {
    console.error("Error in generateTaraReply:", err);
    return getFallbackResponse(err.message);
  }
}

function getFallbackResponse(reason) {
  const messages = [
    "Lagta hai thoda technical issue ho gaya 🫠, but I'm still here for you!",
    "Oops! Something went wrong, but don't worry - I'm still listening 💛",
    "Technical hiccup! But your feelings matter to me, tell me more 🥹",
    "Sorry, having a small glitch! But I'm here and ready to chat 💫"
  ];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  return {
    Reply: randomMessage,
    Mood: "Supportive",
    Reason: `Fallback response: ${reason}`,
    createdAt: new Date().toISOString()
  };
}

export function getAvailableCharacters() {
  return Object.keys(CHARACTER_PROMPTS);
}

export function getCharacterInfo(role) {
  return CHARACTER_PROMPTS[role] || null;
}