import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, title, progress = 0, tags = [] } = body || {};
    if (!userId || !title) return NextResponse.json({ error: 'userId and title required' }, { status: 400 });
    const { db } = await connectToDatabase();
    const normalizedTags = Array.isArray(tags) ? tags.map(t => String(t).trim()).filter(Boolean) : [];
    const doc = { userId, title, progress: Number(progress) || 0, tags: normalizedTags, createdAt: new Date(), updatedAt: new Date() };
    const result = await db.collection('goals').insertOne(doc);
    return NextResponse.json({ ok: true, goal: { ...doc, _id: result.insertedId } });
  } catch (e) {
    console.error('Error adding goal:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


