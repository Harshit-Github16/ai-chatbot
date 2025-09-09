import { NextResponse } from 'next/server';
import { getChats, getAllChatSessions, getUserProfile, getCharacters } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const characterName = searchParams.get('characterName') || 'tara';
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const chats = await getChats(userId, characterName);
    const sessions = await getAllChatSessions(userId);
    const userProfile = await getUserProfile(userId);
    const characters = await getCharacters(userId);

    return NextResponse.json({
      success: true,
      chats,
      count: chats.length,
      sessions,
      userProfile,
      characters
    });

  } catch (error) {
    console.error('Error getting chats:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve chats' },
      { status: 500 }
    );
  }
}
