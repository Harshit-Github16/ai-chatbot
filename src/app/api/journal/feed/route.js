import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'userId required' }, { status: 400 });
        }

        const { db } = await connectToDatabase();

        // Get journal entries sorted by date (newest first)
        const entries = await db.collection('daily_journals')
            .find({ userId })
            .sort({ date: -1 })
            .limit(30) // Last 30 entries
            .toArray();

        return NextResponse.json({ entries });
    } catch (error) {
        console.error('Error fetching journal feed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}