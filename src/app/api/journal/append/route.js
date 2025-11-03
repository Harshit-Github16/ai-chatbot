import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
    try {
        const { userId, text, date } = await request.json();

        if (!userId || !text) {
            return NextResponse.json({ error: 'userId and text are required' }, { status: 400 });
        }

        const { db } = await connectToDatabase();

        // Use provided date or today's date
        const targetDate = date ? new Date(date) : new Date();
        targetDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);

        // Find journal entry for the target date
        let dateEntry = await db.collection('daily_journals').findOne({
            userId,
            date: { $gte: targetDate, $lt: nextDay }
        });

        if (dateEntry) {
            // Append to existing entry with separator
            const separator = dateEntry.content.trim() ? '\n\n' : '';
            const updatedContent = dateEntry.content + separator + text;

            await db.collection('daily_journals').updateOne(
                { _id: dateEntry._id },
                {
                    $set: {
                        content: updatedContent,
                        updatedAt: new Date(),
                        isRealTimeUpdated: true
                    }
                }
            );
        } else {
            // Create new entry for the date
            const journalEntry = {
                userId,
                content: text,
                date: targetDate,
                isAIGenerated: false,
                isRealTimeUpdated: true,
                createdAt: new Date()
            };

            await db.collection('daily_journals').insertOne(journalEntry);
        }

        return NextResponse.json({
            success: true,
            message: 'Journal updated successfully'
        });

    } catch (error) {
        console.error('Error appending to journal:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}