import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = 'Store';

let db;

export async function connectToDatabase() {
  if (!db) {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);
  }
  return db;
}
