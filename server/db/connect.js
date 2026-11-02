import { MongoClient } from 'mongodb';

export async function connectDatabase({ mongoUri, dbName }) {
  const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 8000 });
  await client.connect();

  const db = client.db(dbName);
  await ensureIndexes(db);

  return { client, db };
}

async function ensureIndexes(db) {
  await db.collection('applications').createIndexes([
    { key: { referenceId: 1 }, name: 'referenceId_unique', unique: true },
    { key: { schemeId: 1, createdAt: -1 }, name: 'scheme_createdAt' },
    { key: { status: 1 }, name: 'status' },
  ]);
}
