import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const tag = searchParams.get('tag');
    const limitParam = searchParams.get('limit');
    const limit = Math.min(parseInt(limitParam || '20', 10) || 20, 100);

    if (!userId || !tag) {
      return NextResponse.json({ error: 'userId and tag are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const entries = await db
      .collection('journals')
      .find({ userId, tag })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({ ok: true, entries });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


