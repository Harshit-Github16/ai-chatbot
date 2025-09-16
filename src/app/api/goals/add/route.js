import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, title, progress = 0 } = body || {};
    if (!userId || !title) return NextResponse.json({ error: 'userId and title required' }, { status: 400 });
    const client = await clientPromise;
    const db = client.db();
    const doc = { userId, title, progress: Number(progress) || 0, createdAt: new Date() };
    await db.collection('goals').insertOne(doc);
    return NextResponse.json({ ok: true, goal: doc });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


