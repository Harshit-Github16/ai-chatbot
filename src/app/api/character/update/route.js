import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function PUT(request) {
  try {
    const { userId, characterName, updatedData } = await request.json();
    if (!userId || !characterName || !updatedData) {
      return NextResponse.json({ error: 'userId, characterName, updatedData required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const key = characterName.toLowerCase().replace(/\s+/g, '_');

    const updateFields = {};
    if (typeof updatedData.name === 'string') updateFields[`characters.${key}.name`] = updatedData.name;
    if (typeof updatedData.role === 'string') updateFields[`characters.${key}.role`] = updatedData.role;
    if (typeof updatedData.image === 'string') updateFields[`characters.${key}.image`] = updatedData.image;
    if (typeof updatedData.description === 'string' || updatedData.description === null) updateFields[`characters.${key}.description`] = updatedData.description ?? null;

    const result = await db.collection('users').updateOne(
      { userId },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) return NextResponse.json({ error: 'User or character not found' }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


