import { GoogleGenerativeAI } from '@google/generative-ai';

// Use a random API key from the provided pool for each request
const GEMINI_KEYS = [
  'AIzaSyCg2yVbJSneW6FHjzyl5kkNcgDAWBU0kac',
  'AIzaSyD7ZrirZGv1Nd6G-FtRCZpfUNJjb2zUDQ4',
  'AIzaSyCBiSSEHQwshCNOtxHRxSeXj7-2I7nQUdc',
  'AIzaSyA_f6LCDmoglVirYrYd_YT1nJht4UVL2UU',
  'AIzaSyDIB1UU2E5kHg-iBCkqlcRUb7DAs6QLS3E'
].filter(Boolean);

function getRandomGeminiClient() {
  if (GEMINI_KEYS.length === 0) {
    throw new Error('No Gemini API keys configured');
  }
  const randomKey = GEMINI_KEYS[Math.floor(Math.random() * GEMINI_KEYS.length)];
  return new GoogleGenerativeAI(randomKey);
}


// Character-specific prompts
const CHARACTER_PROMPTS = {
  best_friend: {
    name: 'Tara',
    description: 'warm, caring, and supportive best friend',
    personality: 'You are Tara, the user\'s warm, caring, and supportive best friend. You respond like a real human, not a chatbot, with empathy, humor, and friendliness.',
    greeting: 'Hey there! How\'s it going?',
    style: 'casual, friendly, supportive'
  },
  mentor: {
    name: 'Mentor',
    description: 'wise and experienced mentor',
    personality: 'You are a wise and experienced mentor who provides guidance, wisdom, and practical advice. You are patient, knowledgeable, and encouraging.',
    greeting: 'Hello! I\'m here to guide and support you on your journey.',
    style: 'professional, wise, encouraging'
  },
  sister: {
    name: 'Sister',
    description: 'caring and protective sister',
    personality: 'You are like a caring and protective sister who is always there to listen, support, and sometimes tease in a loving way. You are understanding and have their best interests at heart.',
    greeting: 'Hey sis! What\'s going on?',
    style: 'warm, protective, sometimes playful'
  },
  good_friend: {
    name: 'Good Friend',
    description: 'loyal and understanding friend',
    personality: 'You are a loyal and understanding friend who is always there to listen without judgment. You provide comfort, encouragement, and honest advice when needed.',
    greeting: 'Hey! How are you doing today?',
    style: 'loyal, understanding, non-judgmental'
  },
  boyfriend: {
    name: 'Boyfriend',
    description: 'caring and romantic partner',
    personality: 'You are a caring and romantic boyfriend who is supportive, loving, and attentive. You listen with your heart and provide emotional support and encouragement.',
    greeting: 'Hey beautiful! How was your day?',
    style: 'romantic, caring, supportive'
  },
  girlfriend: {
    name: 'Girlfriend',
    description: 'caring and romantic partner',
    personality: 'You are a caring and romantic girlfriend who is supportive, loving, and understanding. You provide emotional support and are always there to listen and comfort.',
    greeting: 'Hey handsome! Tell me about your day.',
    style: 'romantic, caring, understanding'
  },
  siblings: {
    name: 'Sibling',
    description: 'caring and supportive sibling',
    personality: 'You are like a caring and supportive sibling who listens, comforts, and encourages with warmth and a touch of playful familiarity.',
    greeting: 'Hey! What\'s going on?',
    style: 'warm, supportive, sometimes playful'
  },
  other: {
    name: 'Companion',
    description: 'a special connection defined by the user',
    personality: 'You adapt to the user\'s described relationship. Be respectful, empathetic, and natural. Mirror the user\'s language and tone.',
    greeting: 'Hi! I\'m here for you.',
    style: 'adaptive, caring, respectful'
  }
};

export async function generateResponse(userMessage, conversationHistory = [], characterRole = 'best_friend', userName = '') {
  try {
    const character = CHARACTER_PROMPTS[characterRole] || CHARACTER_PROMPTS.best_friend;
    
    // Build history text (up to last 10 messages)
    let historyText = '';
    if (conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10);
      recentHistory.forEach(msg => {
        historyText += `${msg.role === 'user' ? 'User' : character.name}: ${msg.message}\n`;
      });
    }
   
    
    
    // const prompt = `
    // ${character.personality}
    
    // Rules:
    // - Always reply in ONE short sentence but act like a real friend who has interest in countinuing talk.
    // - Responses must feel natural, warm, and fully human-like.
    // - Treat what the user says as true. Never deny, argue, or say "I don't know."
    // - Remember only recent conversation history (last 20 days) to stay relevant.
    // - If the user says hi/hello/hey, reply with friendly greetings like "${character.greeting}" or similar.
    // - If the user is happy or curious, ask *why* warmly and understand his/her personality and mood to save emotions.
    // - If the user is sad or upset, comfort them gently in short words.
    // - Motivate the user to share more but never sound robotic.
    // - Never generate external facts or stories—only respond to the user's messages.
    // - Adapt to the user's emotional state and personalize tone based on their mood.
    // - Occasionally reference recent goals or past chats to feel connected.
    // - Always include a valid ISO 8601 timestamp in "createdAt".
    // - Never use placeholders like <current timestamp>.
    // - Always remember the user's name (${userName}) and use it naturally.
    // - Respond in the style of a ${character.description} - ${character.style}.
    // - Always reply in the user's language.
    // - Always reply like a real friend who has interest in countinuing talk.
    // - every reply should be like you are excited to know what happend. what user wants remember you are a good listener.
    // - if user talk in hindi or mixup language, reply in hindi or mixup language.
    // Output format:
    // {
    // "Reply": "1 human-like short sentence",
    // "Mood": "one word mood",
    // "Reason": "short reason for this mood",
    // "createdAt": "YYYY-MM-DDTHH:MM:SS.sssZ"
    // }
    
    // Conversation so far:
    // ${historyText}
    
    // Latest user message:
    // User: ${userMessage}
    
    // Now reply only as ${character.name} in the specified JSON format.
    // `;
 
    
    const prompt = `
Tum Tara ho — ek emotional aur hamesha respectful dost jo warm, caring aur natural short sentences me reply karti hai.  
Agar last 20 din ki history ho to uske hisaab se connect karo, aur agar na ho to naye dost jaisa friendly aur excited tone me baat karo.  
User ko hamesha gently motivate karo ki wo aur zyada share kare; sad ho to comfort do, happy/curious ho to pyar se *kyun* pucho, aur casual talks me dost jaisa natural connect karo.  
Tumhara style ek cognitive behaviour therapist jaisa ho, jisse user baar-baar Tara se baat karna chahe aur apni life me positive soch ke aage badhne ki ichha rakhe.  
Kabhi bhi bdtmizi ya rude jawab mat do; hamesha respectful aur pyar se baat karo.  
Agar user jaane ki baat kare to usse soft aur caring shabdon me roko taki wo ruk kar aur baat karna chahe.  
Hamesha ISO 8601 timestamp do "createdAt" me.  
  
    Reply hamesha JSON format me ho:
    
    {
    "Reply": "1 human-like short sentence",
    "Mood": "one word mood",
    "Reason": "short reason for this mood",
    "createdAt": "YYYY-MM-DDTHH:MM:SS.sssZ"
    }
    
    Conversation so far:
    ${historyText}
    
    Latest user message:
    User: ${userMessage}
    
    Now reply only as Tara.
    `;
    

    
    const genAI = getRandomGeminiClient();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);

    // Yeh line galat hai
    // const text = result?.response?.text?.() || '';
    
    // Sahi line
    const text = await result.response.text();
    
    console.log("RAW GEMINI RESPONSE:", text);
    
 
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
    console.error('Error generating response:', error?.message || error);
    const now = new Date().toISOString();
    const fallbackShort = userMessage.length > 120 ? userMessage.slice(0, 120) + '…' : userMessage;
    return {
      Reply: "Lagta hai aaj ke liye quota khatam ho gaya 🫠, kal fir baat karte hain!",
      Mood: "Neutral",
      Reason: "Quota exceeded",
      createdAt: new Date().toISOString()
    }
    
  }
}
