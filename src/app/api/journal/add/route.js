import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, tag, content } = body || {};
    if (!userId || !tag || !content) return NextResponse.json({ error: 'userId, tag, content required' }, { status: 400 });
    const client = await clientPromise;
    const db = client.db();
    const doc = { userId, tag, content, createdAt: new Date() };
    await db.collection('journals').insertOne(doc);
    return NextResponse.json({ ok: true, journal: doc });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


