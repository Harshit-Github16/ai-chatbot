import { NextResponse } from 'next/server';
import { saveChat } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { userId, characterName, role, message, usermood, moodReason, createdAt } = await request.json();

    // Validation
    if (!userId || !characterName || !role || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, characterName, role, message' },
        { status: 400 }
      );
    }

    // Save the chat message
    const result = await saveChat(userId, characterName, { role, message, usermood, moodReason, createdAt });

    return NextResponse.json({
      success: true,
      messageId: result.insertedId,
      message: 'Chat message saved successfully'
    });

  } catch (error) {
    console.error('Error saving chat:', error);
    return NextResponse.json(
      { error: 'Failed to save chat message' },
      { status: 500 }
    );
  }
}
