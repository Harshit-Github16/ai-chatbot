import { NextResponse } from 'next/server';
import { clearChatHistory } from '@/lib/mongodb';

export async function DELETE(request) {
  try {
    const { userId, characterName } = await request.json();

    // Validation
    if (!userId || !characterName) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, characterName' },
        { status: 400 }
      );
    }

    // Clear all conversation history for the character
    const result = await clearChatHistory(userId, characterName);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Chat history cleared successfully for ${characterName}`
    });

  } catch (error) {
    console.error('Error clearing chat history:', error);
    return NextResponse.json(
      { error: 'Failed to clear chat history' },
      { status: 500 }
    );
  }
}
