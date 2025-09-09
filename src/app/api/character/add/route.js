import { NextResponse } from 'next/server';
import { addCharacter } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { userId, characterName, role } = await request.json();

    // Validation
    if (!userId || !characterName || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, characterName, role' },
        { status: 400 }
      );
    }

    // Valid roles
    const validRoles = ['best_friend', 'mentor', 'sister', 'good_friend', 'boyfriend', 'girlfriend', 'brother'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be one of: ' + validRoles.join(', ') },
        { status: 400 }
      );
    }

    // Add character
    const result = await addCharacter(userId, { characterName, role });

    return NextResponse.json({
      success: true,
      message: 'Character added successfully',
      characterName,
      role
    });

  } catch (error) {
    console.error('Error adding character:', error);
    return NextResponse.json(
      { error: 'Failed to add character' },
      { status: 500 }
    );
  }
}
