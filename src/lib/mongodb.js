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

// User profile management
export async function createUserProfile(userId, { name, age, gender }) {
  const { db } = await connectToDatabase();
  const result = await db.collection('users').insertOne({
    userId,
    name,
    age,
    gender,
    characters: {
      tara: {
        name: 'Tara',
        role: 'best_friend',
        conversations: []
      }
    },
    createdAt: new Date()
  });
  return result;
}

export async function getUserProfile(userId) {
  const { db } = await connectToDatabase();
  const user = await db.collection('users').findOne({ userId });
  return user;
}

export async function addCharacter(userId, { characterName, role, image = '/profile.jpg', description }) {
  const { db } = await connectToDatabase();
  const result = await db.collection('users').updateOne(
    { userId },
    {
      $set: {
        [`characters.${characterName.toLowerCase().replace(/\s+/g, '_')}`]: {
          name: characterName,
          role,
          image,
          description: description ?? null,
          conversations: []
        }
      }
    }
  );
  return result;
}

export async function saveChat(userId, characterName, { role, message, usermood, moodReason, createdAt, messageId }) {
  const { db } = await connectToDatabase();
  const { ObjectId } = require('mongodb');
  const now = createdAt ? new Date(createdAt) : new Date();
  const characterKey = characterName.toLowerCase().replace(/\s+/g, '_');
  const _id = messageId || new ObjectId().toString();
  
  const result = await db.collection('users').updateOne(
    { userId },
    {
      $push: {
        [`characters.${characterKey}.conversations`]: {
          _id,
          role,
          message,
          usermood: usermood ?? null,
          moodReason: moodReason ?? null,
          createdAt: now
        }
      }
    }
  );
  return { ...result, insertedId: _id };
}

export async function getChats(userId, characterName = 'tara') {
  const { db } = await connectToDatabase();
  const userDoc = await db.collection('users').findOne({ userId });
  const characterKey = characterName.toLowerCase().replace(/\s+/g, '_');
  return userDoc?.characters?.[characterKey]?.conversations || [];
}

export async function getAllChatSessions(userId) {
  const { db } = await connectToDatabase();
  const userDoc = await db.collection('users').findOne({ userId });
  if (!userDoc?.characters) return [];
  
  return Object.entries(userDoc.characters).map(([key, character]) => {
    const last = character.conversations?.[character.conversations.length - 1];
    return {
      _id: key,
      name: character.name,
      role: character.role,
      lastMessage: last?.message,
      lastTimestamp: last?.createdAt,
      messageCount: character.conversations?.length || 0
    };
  });
}

export async function getCharacters(userId) {
  const { db } = await connectToDatabase();
  const userDoc = await db.collection('users').findOne({ userId });
  return userDoc?.characters || {};
}

// Delete specific message from character's conversation
export async function deleteMessage(userId, characterName, messageId) {
  const { db } = await connectToDatabase();
  const characterKey = characterName.toLowerCase().replace(/\s+/g, '_');
  
  const result = await db.collection('users').updateOne(
    { userId },
    {
      $pull: {
        [`characters.${characterKey}.conversations`]: {
          _id: messageId
        }
      }
    }
  );
  return result;
}

// Clear entire conversation history for a character
export async function clearChatHistory(userId, characterName) {
  const { db } = await connectToDatabase();
  const characterKey = characterName.toLowerCase().replace(/\s+/g, '_');
  
  const result = await db.collection('users').updateOne(
    { userId },
    {
      $set: {
        [`characters.${characterKey}.conversations`]: []
      }
    }
  );
  return result;
}

// Delete entire character and all its data
export async function deleteCharacter(userId, characterName) {
  const { db } = await connectToDatabase();
  const characterKey = characterName.toLowerCase().replace(/\s+/g, '_');
  
  const result = await db.collection('users').updateOne(
    { userId },
    {
      $unset: {
        [`characters.${characterKey}`]: ""
      }
    }
  );
  return result;
}
