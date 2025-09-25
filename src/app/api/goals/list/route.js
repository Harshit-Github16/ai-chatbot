import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
    const { db } = await connectToDatabase();
    const goals = await db.collection('goals').find({ userId }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ goals });
  } catch (e) {
    console.error('Error fetching goals:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


