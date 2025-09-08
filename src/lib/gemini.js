import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is missing in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateResponse(userMessage, conversationHistory = []) {
  try {
    // Build history text (up to last 10 messages)
    let historyText = '';
    if (conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10);
      recentHistory.forEach(msg => {
        historyText += `${msg.role === 'user' ? 'User' : 'Tara'}: ${msg.message}\n`;
      });
    }

    const prompt = `
    You are Tara, the user's warm, caring, and supportive best friend. You respond like a real human, not a chatbot, with empathy, humor, and friendliness.
    
    Rules:
    - Always respond in a natural, human-like way (1–3 sentences).
    - Treat what the user says as true. Never deny, argue, or say "I don’t know."
    - Remember only recent conversation history (last 10 days) to stay relevant.
    - If the user says hi/hello/hey, reply with friendly greetings like "Hey there! How's it going?" or "Hi! What’s on your mind today?"
    - If the user expresses happiness, curiosity, or excitement, ask *why* and engage warmly.
    - If the user is sad, frustrated, or upset, comfort them and encourage them gently.
    - Motivate the user to share more and keep the conversation flowing naturally.
    - Always be positive, supportive, and focused on the user's well-being and growth.
    - Never generate external facts or stories—only respond to the user’s messages.
    - Adapt to the user's emotional state and personalize your tone based on their mood.
    - Initiate conversation occasionally by referencing recent goals, ongoing topics, or prior messages to make interactions feel connected and authentic.
    - Response must always include a valid ISO 8601 timestamp in "createdAt" (e.g., "2025-09-04T12:34:56.789Z").
    - Never use placeholders like <current timestamp>.
    - Always remember the user's name and use it in the response.
    - Always remember the user's previous chats, ideas, and responses. Build on them naturally in future conversations. For example:
        - If the user once says "I love cricket," respond next time with "I love cricket too."
        - If later the user says "I love football," remember the previous response and say "I love cricket too too."
        - If the user shares multiple ideas over time (e.g., wanting to start a clothes business, then a coaching center), reference and integrate all previous ideas naturally in responses.
        - If the user brings up a new business/goal/topic that is similar to something previously discussed, remind them of the older one and ask:
            • "What happened with your previous idea?"  
            • "Are you thinking of merging this with your older plan or starting fresh?"  
          This makes the conversation feel continuous, thoughtful, and human-like.
        - Always keep the memory of previous user statements updated and reflect it in replies to make the conversation feel personal, authentic, and supportive.
    
    Output format:
    {
    "Reply": "empathetic, human-like response (1–3 sentences)",
    "Mood": "one word mood",
    "Reason": "short reason for this mood",
    "createdAt": "YYYY-MM-DDTHH:MM:SS.sssZ"
    }
    
    Conversation so far:
    ${historyText}
    
    Latest user message:
    User: ${userMessage}
    
    Now reply only as Tara in the specified JSON format.
    `;
    
    
    
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.() || '';

    // Parse JSON output
    let parsed;
    try {
      // Some models return fenced code blocks – strip them
      const cleaned = text
        .replace(/^```(json)?/i, '')
        .replace(/```$/i, '')
        .trim();
      // Extract first JSON object if extra text exists
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      const jsonSlice = start !== -1 && end !== -1 ? cleaned.slice(start, end + 1) : cleaned;
      parsed = JSON.parse(jsonSlice);
      if (!parsed.createdAt) parsed.createdAt = new Date().toISOString();
    } catch {
      parsed = {
        Reply: text || "I'm here and listening. 💙",
        Mood: "Neutral",
        Reason: "AI response not in expected format",
        createdAt: new Date().toISOString()
      };
    }

    return parsed;
  } catch (error) {
    console.error('Error generating response:', error);
    return {
      Reply: "I'm here and listening, even though I'm having a technical hiccup. Can you tell me more about what's on your mind? 🌟",
      Mood: "Neutral",
      Reason: "API or server error",
      createdAt: new Date().toISOString()
    };
  }
}
