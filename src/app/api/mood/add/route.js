import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, key, label, emoji, selectedAt } = body || {};
    if (!userId || !key) {
      return NextResponse.json({ error: 'userId and key are required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const doc = {
      userId,
      key,
      label: label || null,
      emoji: emoji || null,
      createdAt: selectedAt ? new Date(selectedAt) : new Date(),
    };
    await db.collection('moods').insertOne(doc);
    return NextResponse.json({ ok: true, mood: doc });
  } catch (e) {
    console.error('Error adding mood:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


