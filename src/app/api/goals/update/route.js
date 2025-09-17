import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function PUT(request) {
  try {
    const body = await request.json();
    const { goalId, userId, title, progress, tags } = body || {};
    if (!goalId || !userId) return NextResponse.json({ error: 'goalId and userId required' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db();

    const { ObjectId } = require('mongodb');
    const filter = { _id: new ObjectId(goalId), userId };
    const update = { $set: { updatedAt: new Date() } };
    if (typeof title === 'string' && title.trim()) update.$set.title = title.trim();
    if (typeof progress !== 'undefined') update.$set.progress = Number(progress) || 0;
    if (Array.isArray(tags)) update.$set.tags = tags.map(t => String(t).trim()).filter(Boolean);

    const result = await db.collection('goals').findOneAndUpdate(filter, update, { returnDocument: 'after' });
    if (!result.value) return NextResponse.json({ error: 'Goal not found' }, { status: 404 });

    return NextResponse.json({ ok: true, goal: result.value });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


