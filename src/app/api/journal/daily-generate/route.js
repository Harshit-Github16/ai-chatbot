import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// This API will be called at day end (like 11:59 PM) to generate complete journal
export async function POST(request) {
    try {
        const { userId, date } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'userId required' }, { status: 400 });
        }

        const { db } = await connectToDatabase();

        // Use provided date or today's date
        const targetDate = date ? new Date(date) : new Date();
        targetDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);

        // Check if journal already exists for this date
        const existingEntry = await db.collection('daily_journals').findOne({
            userId,
            date: { $gte: targetDate, $lt: nextDay }
        });

        if (existingEntry) {
            return NextResponse.json({
                success: true,
                entry: existingEntry,
                message: 'Journal already exists for this date'
            });
        }

        // Get user's conversations for this date
        const userDoc = await db.collection('users').findOne({ userId });

        if (!userDoc?.characters) {
            return NextResponse.json({
                error: 'No conversations found for this user'
            }, { status: 404 });
        }

        // Collect all conversations from the target date
        const dayChats = [];
        Object.values(userDoc.characters).forEach(character => {
            if (character.conversations) {
                character.conversations.forEach(msg => {
                    const msgDate = new Date(msg.createdAt);
                    if (msgDate >= targetDate && msgDate < nextDay) {
                        dayChats.push({
                            role: msg.role,
                            message: msg.message,
                            createdAt: msgDate,
                            characterName: character.name,
                            usermood: msg.usermood,
                            moodReason: msg.moodReason
                        });
                    }
                });
            }
        });

        if (dayChats.length === 0) {
            return NextResponse.json({
                error: 'No conversations found for this date'
            }, { status: 404 });
        }

        // Sort by time (chronological order)
        dayChats.sort((a, b) => a.createdAt - b.createdAt);

        // Generate complete journal entry using AI
        const journalContent = await generateCompleteJournal(dayChats, userId);

        // Save the generated journal
        const journalEntry = {
            userId,
            content: journalContent,
            date: targetDate,
            isAIGenerated: true,
            isDayEndGenerated: true,
            chatCount: dayChats.length,
            createdAt: new Date()
        };

        const result = await db.collection('daily_journals').insertOne(journalEntry);

        return NextResponse.json({
            success: true,
            entry: { ...journalEntry, _id: result.insertedId },
            message: `Complete journal generated from ${dayChats.length} conversations!`
        });

    } catch (error) {
        console.error('Error generating daily journal:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function generateCompleteJournal(chatMessages, userId) {
    try {
        // Prepare complete chat context with timeline
        const chatContext = chatMessages
            .map((msg, index) => {
                const time = new Date(msg.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                return `[${time}] ${msg.role === 'user' ? 'Me' : msg.characterName}: ${msg.message}`;
            })
            .join('\n');

        // Extract all moods and emotions from the day
        const moods = chatMessages
            .filter(msg => msg.usermood)
            .map(msg => `${msg.usermood}: ${msg.moodReason || 'No reason given'}`)
            .join(', ');

        console.log('Chat context for AI:', chatContext);
        console.log('Number of messages:', chatMessages.length);

        const prompt = `You are writing a personal diary entry. Based on these ACTUAL conversations from today, write exactly what happened and how the person felt.

TODAY'S ACTUAL CONVERSATIONS:
${chatContext}

DETECTED MOODS: ${moods || 'No specific moods recorded'}

CRITICAL INSTRUCTIONS:
- Write about the ACTUAL conversations that happened
- If user said "I am very happy for my friend he got a govt job" - mention that EXACTLY
- If user said "Arre yaar, ye sunke bada dukh hua" - mention that feeling
- If user was confused about "fear vs courage" - mention that confusion
- DO NOT write generic lines like "feelings ko samajhne ki koshish ki"
- Write about SPECIFIC things that happened in the conversations
- Use the user's actual words and emotions
- Show the real emotional journey from the actual chats
- Write in natural Hinglish like a real diary
- Include ALL important topics that were actually discussed

Example of what to write:
"Aaj morning mein bahut khush tha kyunki mere friend ko government job mil gayi. That was such amazing news! But phir kuch aur baat sunke dukh hua. Then I got confused about fear aur courage ke beech mein choice karna. Overall mixed emotions ka din tha."

Write the actual journal entry based on real conversations:`;

        // Call GROQ API for comprehensive journal
        const aiResponse = await callGroqAPI(prompt);

        if (!aiResponse) {
            // Better fallback based on actual chat content
            const userMessages = chatMessages.filter(msg => msg.role === 'user');
            if (userMessages.length > 0) {
                const firstMsg = userMessages[0].message;
                const lastMsg = userMessages[userMessages.length - 1].message;
                return `Aaj ki conversations mein pehle "${firstMsg}" ke baare mein baat ki, aur baad mein "${lastMsg}" discuss kiya. Overall ${chatMessages.length} messages ke saath meaningful day tha.`;
            }
        }

        return aiResponse;

    } catch (error) {
        console.error('Error generating complete journal:', error);
        console.error('Chat messages were:', chatMessages.map(m => `${m.role}: ${m.message}`));
        return `Aaj ka din conversations se bhara tha. Kuch khushi, kuch confusion, overall ek normal day tha with ${chatMessages.length} meaningful interactions.`;
    }
}

async function callGroqAPI(prompt) {
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: 'You are writing a personal diary entry based on ACTUAL conversations. Write about what REALLY happened in the chats. Use the user\'s exact words and emotions. DO NOT write generic statements. Focus on specific events, feelings, and topics that were actually discussed. Write in natural Hinglish like a real person documenting their actual day.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                model: 'llama3-8b-8192',
                stream: false,
                temperature: 0.2,
                max_tokens: 400
            })
        });

        if (!response.ok) {
            console.error(`GROQ API error: ${response.status}`);
            return null;
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || null;

    } catch (error) {
        console.error('GROQ API call failed:', error);
        return null;
    }
}