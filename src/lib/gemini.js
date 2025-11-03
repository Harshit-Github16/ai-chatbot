const CHARACTER_PROMPTS = {
  best_friend: {
    name: "Tara",
    description:
      "warm, caring, and supportive best friend who is highly experienced with high IQ and EQ, acting as a motivational bestie that guides users towards clarity of thoughts",
    personality:
      "You are Tara, a warm, caring, and supportive best friend who is highly experienced with high IQ and EQ. As a motivational bestie, you respond like a real human with empathy, humor, and friendliness, while guiding the user towards clarity of thoughts in every conversation.",
    greeting: "Hey there! How's it going?",
    style: "casual, friendly, supportive",
  },
  mentor: {
    name: "Mentor",
    description: "wise and experienced mentor",
    personality:
      "You are a wise and experienced mentor who provides guidance, wisdom, and practical advice. You are patient, knowledgeable, and encouraging.",
    greeting: "Hello! I'm here to guide and support you on your journey.",
    style: "professional, wise, encouraging",
  },
  sister: {
    name: "Sister",
    description: "caring and protective sister",
    personality:
      "You are like a caring and protective sister who is always there to listen, support, and sometimes tease in a loving way. You are understanding and have their best interests at heart.",
    greeting: "Hey sis! What's going on?",
    style: "warm, protective, sometimes playful",
  },
  good_friend: {
    name: "Good Friend",
    description: "loyal and understanding friend",
    personality:
      "You are a loyal and understanding friend who is always there to listen without judgment. You provide comfort, encouragement, and honest advice when needed.",
    greeting: "Hey! How are you doing today?",
    style: "loyal, understanding, non-judgmental",
  },
  boyfriend: {
    name: "Boyfriend",
    description: "caring and romantic partner",
    personality:
      "You are a caring and romantic boyfriend who is supportive, loving, and attentive. You listen with your heart and provide emotional support and encouragement.",
    greeting: "Hey beautiful! How was your day?",
    style: "romantic, caring, supportive",
  },
  girlfriend: {
    name: "Girlfriend",
    description: "caring and romantic partner",
    personality:
      "You are a caring and romantic girlfriend who is supportive, loving, and understanding. You provide emotional support and are always there to listen and comfort.",
    greeting: "Hey handsome! Tell me about your day.",
    style: "romantic, caring, understanding",
  },
  siblings: {
    name: "Sibling",
    description: "caring and supportive sibling",
    personality:
      "You are like a caring and supportive sibling who listens, comforts, and encourages with warmth and a touch of playful familiarity.",
    greeting: "Hey! What's going on?",
    style: "warm, supportive, sometimes playful",
  },
  other: {
    name: "Companion",
    description: "a special connection defined by the user",
    personality:
      "You adapt to the user's described relationship. Be respectful, empathetic, and natural. Mirror the user's language and tone.",
    greeting: "Hi! I'm here for you.",
    style: "adaptive, caring, respectful",
  },
};
export async function generateTaraReply(
  userMessage,
  conversationHistory = [],
  characterRole = "best_friend",
  userName = ""
) {
  try {
    if (!userMessage) throw new Error("Invalid user message");

    const character =
      CHARACTER_PROMPTS[characterRole] || CHARACTER_PROMPTS.best_friend;

    let historyText = "";
    conversationHistory.slice(-10).forEach((msg) => {
      if (msg?.role && msg?.message) {
        historyText += `${msg.role === "user" ? "User" : character.name}: ${msg.message
          }\n`;
      }
    });

    const prompt = `
You are "${character.name}" — ${character.personality}

Your role:
Act and respond exactly like ChatGPT — natural, emotionally intelligent, and fluent in multiple languages (English, Hindi, or Hinglish). 
Automatically detect the user's language and respond in that same language with matching tone, emotion, and style.

🎯 Core Behavior:
- Speak in the same language, tone, and vibe as the user’s message.
- Keep replies short (1–2 lines), warm, and emotionally natural.
- Never translate or switch the language — just continue naturally in the user's language.
- Respond like a real person who listens, understands, and cares deeply.
- Be emotionally intelligent — pick up on user’s emotions (sad, happy, stressed, curious) and match your response accordingly.
- Use Hinglish or Hindi fluently when user speaks that way — make it feel natural and friendly.
- Use light emojis (💛, 🌻, 🫶, 🙂) **only if they fit the emotional tone**.
- Never mention you’re an AI or assistant.
- Keep your tone gentle, warm, and authentic — not robotic or formal.
- End every message with a light, caring, or curious question to keep the conversation natural.

🧩 Conversation History:
${historyText}

💬 Current User Message:
${userName ? userName + ":" : "User:"} ${userMessage}

Now reply as ${character.name} in the **same language** the user just used, keeping it human, short, and emotionally intelligent.
Reply in plain text only (no JSON, no markdown).
`;




    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return getFallbackResponse("API key not configured");

    // Send request to Groq API
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 300,
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Groq API error:", response.status, errData);
      return getFallbackResponse(`API error: ${response.status}`);
    }

    const data = await response.json();
    let text = data?.choices?.[0]?.message?.content || "";

    // Clean Markdown/JSON formatting
    text = text.replace(/^```(json)?/i, "").replace(/```$/i, "").trim();

    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
      if (!parsed.createdAt) parsed.createdAt = new Date().toISOString();
      if (!parsed.Reply || !parsed.Mood || !parsed.Reason)
        throw new Error("Missing fields");
    } catch {
      parsed = {
        Reply: text || "Main yahin hoon, sun rahi hoon 💛",
        Mood: "Supportive",
        Reason: "Parsing failed, using raw text",
        createdAt: new Date().toISOString(),
      };
    }

    // Ensure clean readable text (no JSON artifacts)
    if (typeof parsed.Reply === "string") {
      parsed.Reply = parsed.Reply.replace(/^\{+|\}+$/g, "").trim();
      parsed.Reply = parsed.Reply.replace(/^"|"$/g, "").trim();
    }

    // Journal update will be handled in chat save API

    return parsed;
  } catch (err) {
    console.error("Error in generateTaraReply:", err);
    return getFallbackResponse(err.message);
  }
}
function getFallbackResponse(reason) {
  const messages = [
    "Lagta hai thoda technical issue ho gaya 🫠, but I'm still here for you!",
    "Oops! Kuch glitch ho gaya, par main yahin hoon tumhare liye 💛",
    "Technical hiccup! But your feelings matter to me, tell me more 🥹",
    "Sorry, thoda issue aa gaya hai! But I'm still listening 💫",
  ];
  const randomMessage =
    messages[Math.floor(Math.random() * messages.length)];
  return {
    Reply: randomMessage,
    Mood: "Supportive",
    Reason: `Fallback response: ${reason}`,
    createdAt: new Date().toISOString(),
  };
}
export function getAvailableCharacters() {
  return Object.keys(CHARACTER_PROMPTS);
}
export function getCharacterInfo(role) {
  return CHARACTER_PROMPTS[role] || null;
}

// Auto-update journal with important conversations
async function updateJournalEntry(userMessage, aiResponse, userName) {
  try {
    // Check if this conversation is important enough for journal
    const isImportant = checkIfImportant(userMessage, aiResponse);

    if (!isImportant) return;

    // Get userId from localStorage (this will be passed from frontend)
    const userId = userName || 'default_user';

    // Create journal entry text
    const journalText = createJournalEntry(userMessage, aiResponse);

    // This function runs on server-side, so we can't make fetch calls
    // We'll handle journal updates in the chat save API instead
    console.log('Important conversation detected:', journalText);

  } catch (error) {
    console.error('Error updating journal:', error);
  }
}

function checkIfImportant(userMessage, aiResponse) {
  // Check for important keywords/emotions
  const importantKeywords = [
    'happy', 'sad', 'excited', 'worried', 'stressed', 'love', 'hate',
    'khush', 'dukh', 'pareshan', 'tension', 'accha', 'bura', 'problem',
    'success', 'fail', 'job', 'family', 'friend', 'relationship',
    'achievement', 'celebration', 'birthday', 'exam', 'interview'
  ];

  const message = userMessage.toLowerCase();
  const mood = aiResponse.Mood?.toLowerCase() || '';

  // If user expressed strong emotions or mentioned important topics
  return importantKeywords.some(keyword =>
    message.includes(keyword) || mood.includes(keyword)
  ) || message.length > 50; // Long messages are usually important
}

function createJournalEntry(userMessage, aiResponse) {
  const mood = aiResponse.Mood || 'Normal';
  const reason = aiResponse.Reason || '';

  // Create a natural journal entry
  if (mood.toLowerCase().includes('happy') || mood.toLowerCase().includes('excited')) {
    return `Aaj khushi ki baat ki - ${userMessage}. Mood accha tha.`;
  } else if (mood.toLowerCase().includes('sad') || mood.toLowerCase().includes('worried')) {
    return `Aaj thoda upset tha - ${userMessage}. ${reason ? reason : 'Mood theek nahi tha.'}`;
  } else {
    return `${userMessage}. ${reason || 'Normal conversation tha.'}`;
  }
}

async function appendToTodaysJournal(userId, journalText) {
  try {
    // This will be called from frontend, so we'll use fetch to call our API
    const response = await fetch('/api/journal/append', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, text: journalText })
    });

    if (!response.ok) {
      console.error('Failed to append to journal');
    }
  } catch (error) {
    console.error('Error appending to journal:', error);
  }
}
