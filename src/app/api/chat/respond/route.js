import { NextResponse } from 'next/server';
import { generateResponse } from '@/lib/gemini';
import { getChats, saveChat } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { userId, message } = await request.json();

    // Validation
    if (!userId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, message' },
        { status: 400 }
      );
    }

    // Get conversation history for this user
    const conversationHistory = await getChats(userId);

    // Generate AI response
    const botResponse = await generateResponse(message, conversationHistory);

    // Save user message
    await saveChat(userId, { role: 'user', message, createdAt: new Date().toISOString() });

    // Save bot response
    await saveChat(userId, { role: 'bot', message: botResponse.Reply, usermood: botResponse.Mood, moodReason: botResponse.Reason, createdAt: botResponse.createdAt });

    return NextResponse.json({
      success: true,
      response: botResponse,
      userId
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
