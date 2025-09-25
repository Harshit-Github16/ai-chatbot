import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const query = { userId };
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const { db } = await connectToDatabase();
    const moods = await db.collection('moods').find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ moods });
  } catch (e) {
    console.error('Error fetching moods:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


