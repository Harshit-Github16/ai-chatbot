import { NextResponse } from 'next/server';
import { deleteMessage } from '@/lib/mongodb';

export async function DELETE(request) {
  try {
    const { userId, messageId, characterName } = await request.json();

    // Validation
    if (!userId || !messageId || !characterName) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, messageId, characterName' },
        { status: 400 }
      );
    }

    // Delete the specific message
    const result = await deleteMessage(userId, characterName, messageId);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Message not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
