import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
    const client = await clientPromise;
    const db = client.db();
    const goals = await db.collection('goals').find({ userId }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ goals });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


