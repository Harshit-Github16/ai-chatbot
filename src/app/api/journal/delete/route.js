import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(request) {
    try {
        const { entryId, userId } = await request.json();

        if (!entryId || !userId) {
            return NextResponse.json({
                error: 'entryId aur userId dono chahiye'
            }, { status: 400 });
        }

        const { db } = await connectToDatabase();

        // Delete the journal entry
        const result = await db.collection('daily_journals').deleteOne({
            _id: new ObjectId(entryId),
            userId // Ensure user can only delete their own entries
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({
                error: 'Journal entry nahi mili ya delete nahi ho saki'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Journal entry delete ho gayi!'
        });

    } catch (error) {
        console.error('Error deleting journal entry:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}