import { NextResponse } from 'next/server';
import { generateTaraReply } from '@/lib/gemini';
import { getChats, saveChat, getUserProfile, connectToDatabase } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const { userId, message, characterName = 'tara' } = await request.json();

    // Validation
    if (!userId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, message' },
        { status: 400 }
      );
    }

    // Get user profile and conversation history
    const userProfile = await getUserProfile(userId);
    const conversationHistory = await getChats(userId, characterName);
    const userName = userProfile?.name || '';

    // Get character role from user profile
    const characterRole = userProfile?.characters?.[characterName.toLowerCase().replace(/\s+/g, '_')]?.role || 'best_friend';

    // Generate AI response
    const botResponse = await generateTaraReply(message, conversationHistory, characterRole, userName);

    // Save user message with unique ID
    const userMessageId = uuidv4();
    await saveChat(userId, characterName, { 
      role: 'user', 
      message, 
      createdAt: new Date().toISOString(),
      messageId: userMessageId
    });

    // Save bot response with unique ID
    const botMessageId = uuidv4();
    await saveChat(userId, characterName, { 
      role: 'bot', 
      message: botResponse.Reply, 
      usermood: botResponse.Mood, 
      moodReason: botResponse.Reason, 
      createdAt: botResponse.createdAt,
      messageId: botMessageId
    });

    // Real-time journal append using user's message and detected mood
    try {
      await updateJournalRealTime(userId, message, botResponse.Mood, botResponse.Reason);
    } catch (journalError) {
      console.error('Journal auto-update (respond) failed:', journalError);
    }

    return NextResponse.json({
      success: true,
      response: botResponse,
      userId,
      characterName
    });

  } catch (error) {
    console.error('Error generating response:', error);
    
    // Provide a fallback empathetic response
    const fallbackResponse = "I'm experiencing a small technical hiccup, but I want you to know that I'm here for you. Your feelings and thoughts are important to me. Can you tell me a bit more about what's on your mind? 💙";
    
    return NextResponse.json(
      { 
        success: false, 
        response: fallbackResponse,
        error: 'AI service temporarily unavailable'
      },
      { status: 200 } // Return 200 so the fallback response is shown
    );
  }
}

// Keep the journal update logic aligned with chat/save API
async function updateJournalRealTime(userId, userMessage, mood, moodReason) {
  try {
    const { db } = await connectToDatabase();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Always append to journal for continuity
    const journalText = createJournalEntryFromMessage(userMessage, mood, moodReason);

    let todayEntry = await db.collection('daily_journals').findOne({
      userId,
      date: { $gte: today, $lt: tomorrow }
    });

    if (todayEntry) {
      const existing = (todayEntry.content || '').trim();
      if (existing.endsWith(journalText)) return;
      const updatedContent = existing ? existing + '\n\n' + journalText : journalText;
      await db.collection('daily_journals').updateOne(
        { _id: todayEntry._id },
        { $set: { content: updatedContent, updatedAt: new Date(), isRealTimeUpdated: true } }
      );
    } else {
      const journalEntry = {
        userId,
        content: journalText,
        date: new Date(),
        isAIGenerated: false,
        isRealTimeUpdated: true,
        createdAt: new Date()
      };
      await db.collection('daily_journals').insertOne(journalEntry);
    }
  } catch (error) {
    console.error('Error in real-time journal update (respond):', error);
  }
}

function createJournalEntryFromMessage(message, mood, moodReason) {
  const text = (message || '').toLowerCase();
  const normalizedMood = (mood || '').toLowerCase();
  const reason = extractReasonPhrase(text);

  if (/jackpot|win|won|prize|crore/.test(text) || normalizedMood.includes('happy') || normalizedMood.includes('excited')) {
    if (reason) {
      return `Aaj bahut khushi hui — ${reason}.`;
    }
    return `Aaj overall positive feel hua${moodReason ? `, kyunki ${moodReason}.` : '.'}`;
  }

  if (/lost|lose|gaya|gayi|chala\s+gaya|gone|death|cat|dog|pet/.test(text) || normalizedMood.includes('sad') || normalizedMood.includes('worried')) {
    return `Dil thoda heavy raha${moodReason ? ` — ${moodReason}` : ''}. Par khud ko sambhalne ki koshish ki.`;
  }

  if (/puppy|dog|pet|new\s+(friend|job|start|beginning)/.test(text)) {
    return 'Kuch naya shuru hua jisse halka sa excitement aur warmth mehsoos hua.';
  }

  if (normalizedMood.includes('confused') || /confused|dilemma|soch|samajh/.test(text)) {
    return `Thodi uljhan bhi rahi${moodReason ? ` — ${moodReason}` : ''}, is par aage aur sochne ka mann hai.`;
  }

  return 'Aaj kuch baaton par khud se baat ki aur feelings ko samajhne ki koshish ki.';
}

function extractReasonPhrase(text) {
  if (/jackpot|lottery|jack\s*pot|crore|lakh/.test(text)) return 'jackpot laga';
  if (/(found|got|adopted|mil[aie]?|liya)\s+(a\s+)?puppy|new\s+puppy/.test(text)) return 'naya puppy mila';
  if (/(got|received|mili|mila)\s+(a\s+)?job|job\s+mili|govt\s+job/.test(text)) return 'job mil gayi';
  if (/promotion|promoted/.test(text)) return 'promotion mila';
  if (/passed|clear(ed)?|qualif(y|ied)|result\s+aa?ya|exam\s+(clear|pass)/.test(text)) return 'exam pass hua';
  if (/won\s+(the\s+)?match|match\s+jeet|trophy|medal/.test(text)) return 'match jeeta';
  if (/(lost|lose)\s+(my\s+)?(cat|dog|pet)|cat\s+g(a|e)yi|pet\s+chala\s+gaya/.test(text)) return 'mera pet chala gaya';
  if (/break\s*up|breakup|relationship\s+end/.test(text)) return 'relationship khatam ho gaya';
  if (/fail(ed)?\s+exam|exam\s+fail|result\s+kharab/.test(text)) return 'exam theek nahi gaya';
  if (/new\s+(project|start|beginning)/.test(text)) return 'naya start hua';
  return '';
}
