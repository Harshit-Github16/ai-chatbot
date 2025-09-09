import { NextResponse } from 'next/server';
import { createUserProfile, getUserProfile } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { userId, name, age, gender } = await request.json();

    // Validation
    if (!userId || !name || !age || !gender) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, name, age, gender' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserProfile(userId);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User profile already exists' },
        { status: 400 }
      );
    }

    // Create user profile
    const result = await createUserProfile(userId, { name, age, gender });

    return NextResponse.json({
      success: true,
      message: 'User profile created successfully',
      userId
    });

  } catch (error) {
    console.error('Error creating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to create user profile' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const userProfile = await getUserProfile(userId);

    return NextResponse.json({
      success: true,
      userProfile
    });

  } catch (error) {
    console.error('Error getting user profile:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve user profile' },
      { status: 500 }
    );
  }
}
