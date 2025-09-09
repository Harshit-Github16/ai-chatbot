import { NextResponse } from 'next/server';
import { deleteCharacter } from '@/lib/mongodb';

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

    // Don't allow deletion of Tara (main character)
    if (characterName.toLowerCase() === 'tara') {
      return NextResponse.json(
        { error: 'Cannot delete Tara - she is the main character' },
        { status: 400 }
      );
    }

    // Delete the entire character and all its data
    const result = await deleteCharacter(userId, characterName);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Character ${characterName} deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting character:', error);
    return NextResponse.json(
      { error: 'Failed to delete character' },
      { status: 500 }
    );
  }
}
