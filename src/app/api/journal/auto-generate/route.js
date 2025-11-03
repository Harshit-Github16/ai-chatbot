import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// This endpoint can be called daily to auto-generate journal entries for all users
export async function POST(request) {
    try {
        const { db } = await connectToDatabase();

        // Get all users who have had conversations today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find all users
        const users = await db.collection('users').find({}).toArray();

        const results = [];

        for (const user of users) {
            try {
                // Check if user already has today's journal entry
                const existingEntry = await db.collection('daily_journals').findOne({
                    userId: user.userId,
                    date: { $gte: today }
                });

                if (existingEntry) {
                    results.push({
                        userId: user.userId,
                        status: 'skipped',
                        reason: 'Entry already exists for today'
                    });
                    continue;
                }

                // Check if user had any conversations today
                let hasConversationsToday = false;
                if (user.characters) {
                    Object.values(user.characters).forEach(character => {
                        if (character.conversations) {
                            const todayConversations = character.conversations.filter(msg => {
                                const msgDate = new Date(msg.createdAt);
                                return msgDate >= today;
                            });
                            if (todayConversations.length > 0) {
                                hasConversationsToday = true;
                            }
                        }
                    });
                }

                if (!hasConversationsToday) {
                    results.push({
                        userId: user.userId,
                        status: 'skipped',
                        reason: 'No conversations today'
                    });
                    continue;
                }

                // Generate journal entry for this user
                const generateResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/journal/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.userId, mode: 'append' })
                });

                if (generateResponse.ok) {
                    results.push({
                        userId: user.userId,
                        status: 'success',
                        reason: 'Journal entry generated'
                    });
                } else {
                    const errorData = await generateResponse.json();
                    results.push({
                        userId: user.userId,
                        status: 'error',
                        reason: errorData.error || 'Generation failed'
                    });
                }

            } catch (userError) {
                results.push({
                    userId: user.userId,
                    status: 'error',
                    reason: userError.message
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${users.length} users`,
            results,
            summary: {
                total: users.length,
                generated: results.filter(r => r.status === 'success').length,
                skipped: results.filter(r => r.status === 'skipped').length,
                errors: results.filter(r => r.status === 'error').length
            }
        });

    } catch (error) {
        console.error('Error in auto-generate:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET endpoint to check status
export async function GET() {
    try {
        const { db } = await connectToDatabase();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Count today's entries
        const todayEntries = await db.collection('daily_journals').countDocuments({
            date: { $gte: today }
        });

        // Count total users
        const totalUsers = await db.collection('users').countDocuments({});

        return NextResponse.json({
            success: true,
            todayEntries,
            totalUsers,
            date: today.toISOString()
        });

    } catch (error) {
        console.error('Error checking auto-generate status:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}