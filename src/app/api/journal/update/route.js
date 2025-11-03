import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request) {
    try {
        const { entryId, userId, content } = await request.json();

        if (!entryId || !userId || !content) {
            return NextResponse.json({
                error: 'entryId, userId, and content are required'
            }, { status: 400 });
        }

        const { db } = await connectToDatabase();

        // Update the journal entry
        const result = await db.collection('daily_journals').updateOne(
            {
                _id: new ObjectId(entryId),
                userId // Ensure user can only update their own entries
            },
            {
                $set: {
                    content,
                    updatedAt: new Date(),
                    isEdited: true
                }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({
                error: 'Journal entry not found or access denied'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Journal entry updated successfully'
        });

    } catch (error) {
        console.error('Error updating journal entry:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}