import { NextResponse } from 'next/server';
import { generateResponse } from '@/lib/gemini';
import { getChats, saveChat, getUserProfile } from '@/lib/mongodb';
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
    const botResponse = await generateResponse(message, conversationHistory, characterRole, userName);

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
