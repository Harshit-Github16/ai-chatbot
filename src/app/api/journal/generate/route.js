import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
    try {
        const { userId, mode } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'userId required' }, { status: 400 });
        }

        const { db } = await connectToDatabase();

        // Check if entry already exists for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const existingEntry = await db.collection('daily_journals').findOne({
            userId,
            date: { $gte: today, $lt: tomorrow }
        });

        const shouldAppend = mode === 'append';

        // Get today's chat messages (from start of today)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        // Get user document with all character conversations
        const userDoc = await db.collection('users').findOne({ userId });

        if (!userDoc?.characters) {
            // No chat history, create a default entry
            const journalEntry = {
                userId,
                content: "Aaj ek shant din tha. Maine apne thoughts aur feelings ke saath time spend kiya. Kabhi kabhi sabse meaningful days woh hote hain jahan hum bas exist karte hain aur appreciate karte hain jo humhare paas hai.",
                date: new Date(),
                isAIGenerated: true,
                createdAt: new Date()
            };

            const result = await db.collection('daily_journals').insertOne(journalEntry);
            return NextResponse.json({
                success: true,
                entry: { ...journalEntry, _id: result.insertedId }
            });
        }

        // Collect all today's conversations from all characters
        const todaysChats = [];
        Object.values(userDoc.characters).forEach(character => {
            if (character.conversations) {
                character.conversations.forEach(msg => {
                    const msgDate = new Date(msg.createdAt);
                    if (msgDate >= todayStart) {
                        todaysChats.push({
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

        // Sort by date (chronological order for better context)
        todaysChats.sort((a, b) => a.createdAt - b.createdAt);

        // Generate journal entry using AI based on today's chats
        const journalContent = await generateJournalWithAI(todaysChats, userId);

        // Save or append the generated entry
        if (existingEntry && shouldAppend) {
            const updatedContent = (existingEntry.content ? existingEntry.content + '\n\n' : '') + journalContent;
            await db.collection('daily_journals').updateOne(
                { _id: existingEntry._id },
                { $set: { content: updatedContent, updatedAt: new Date(), isAIGenerated: true, chatCount: todaysChats.length } }
            );
            const updated = await db.collection('daily_journals').findOne({ _id: existingEntry._id });
            return NextResponse.json({ success: true, entry: updated, message: 'Today\'s journal appended with AI summary.' });
        } else {
            if (existingEntry && !shouldAppend) {
                await db.collection('daily_journals').deleteOne({ _id: existingEntry._id });
            }
            const journalEntry = {
                userId,
                content: journalContent,
                date: new Date(),
                isAIGenerated: true,
                chatCount: todaysChats.length,
                createdAt: new Date()
            };
            const result = await db.collection('daily_journals').insertOne(journalEntry);
            return NextResponse.json({
                success: true,
                entry: { ...journalEntry, _id: result.insertedId },
                message: `Complete journal entry generated from all today's chats!`
            });
        }

    } catch (error) {
        console.error('Error generating journal entry:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function generateJournalWithAI(chatMessages, userId) {
    try {
        if (!chatMessages || chatMessages.length === 0) {
            return "Aaj zyada chat nahi ki. Bas thoda relax kiya.";
        }

        // Prepare chat context for AI - include bot messages saved as 'bot'
        const userMessages = chatMessages.filter(msg => msg.role === 'user' && msg.message && msg.message.trim());
        const aiResponses = chatMessages.filter(msg => msg.role === 'bot' && msg.message && msg.message.trim());

        // Get mood information if available
        const moodInfo = chatMessages.find(msg => msg.usermood)?.usermood || null;
        const moodReason = chatMessages.find(msg => msg.moodReason)?.moodReason || null;

        // Include ALL today's messages with timestamps for better context
        const chatContext = chatMessages
            .map((msg) => {
                const speaker = msg.role === 'user' ? 'Me' : (msg.characterName || 'Tara');
                return `${speaker}: ${msg.message}`;
            })
            .join('\n');

        const prompt = `User ke actual chat messages ke basis pe ek natural, personal journal entry likho. Sirf ACTUAL conversations ka content use karo, koi generic feelings ya advice nahi.

Aaj ke conversations:
${chatContext}

${moodInfo ? `User ka mood: ${moodInfo}` : ''}
${moodReason ? `Mood reason: ${moodReason}` : ''}

CRITICAL INSTRUCTIONS:
- Sirf actual chat topics aur conversations mention karo
- Koi generic "feelings samjhane ki koshish" ya "emotional growth" wali bakwas nahi
- Real conversations ka content paraphrase karo first person mein
- Specific topics, events, aur actual discussions mention karo
- Agar koi specific problem discuss ki thi, uska exact context do
- Koi philosophical advice ya generic statements bilkul nahi
- Natural Hinglish mein likho jaise main apni diary mein likhta hun

Example: "Aaj maine Tara se apne office ke boss ke baare mein baat ki. Woh bahut rude tha meeting mein. Phir maine pucha ki kaise handle karu. Tara ne kaha ki direct approach try karu. Mujhe laga ki maybe right hai."

Journal Entry:`;

        // Call GROQ API
        const aiResponse = await callGroqAPI(prompt);

        return aiResponse || "Aaj AI se thodi baat ki. Mood accha tha.";

    } catch (error) {
        console.error('Error calling AI API:', error);
        // Fallback content in Hinglish
        return "Aaj kuch khaas nahi hua. Bas normal day tha.";
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
                        content: 'You are writing a personal diary entry based ONLY on actual chat conversations. DO NOT add generic emotional advice or philosophical statements. Only mention what was actually discussed in the chats. Write in natural Hinglish like a real person documenting their day. Focus on specific topics, problems, and conversations that actually happened. No generic "feelings ko samjhane ki koshish" type content.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                model: 'llama3-8b-8192',
                stream: false,
                temperature: 0.3,
                max_tokens: 300
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