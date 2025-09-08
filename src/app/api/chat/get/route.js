import { NextResponse } from 'next/server';
import { getChats, getAllChatSessions } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const chats = await getChats(userId);
    const sessions = await getAllChatSessions(userId);

    return NextResponse.json({
      success: true,
      chats,
      count: chats.length,
      sessions
    });

  } catch (error) {
    console.error('Error getting chats:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve chats' },
      { status: 500 }
    );
  }
}
