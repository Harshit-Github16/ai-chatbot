import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Database helper functions
export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db('tara_chatbot');
  return { client, db };
}

export async function saveChat(userId, { role, message, usermood, moodReason, createdAt }) {
  const { db } = await connectToDatabase();
  const now = createdAt ? new Date(createdAt) : new Date();
  const result = await db.collection('chats').updateOne(
    { userId },
    {
      $setOnInsert: { userId },
      $push: {
        conversations: {
          role,
          message,
          usermood: usermood ?? null,
          moodReason: moodReason ?? null,
          createdAt: now
        }
      }
    },
    { upsert: true }
  );
  return result;
}

export async function getChats(userId) {
  const { db } = await connectToDatabase();
  const userDoc = await db.collection('chats').findOne({ userId });
  return userDoc?.conversations || [];
}

export async function getAllChatSessions(userId) {
  const { db } = await connectToDatabase();
  const doc = await db.collection('chats').findOne({ userId });
  const last = doc?.conversations?.[doc.conversations.length - 1];
  const count = doc?.conversations?.length || 0;
  return [{ _id: userId, lastMessage: last?.message, lastTimestamp: last?.createdAt, messageCount: count }];
}
