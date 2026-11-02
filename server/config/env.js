const DEFAULT_PORT = 5001;
const DEFAULT_DB_NAME = 'grantwise';

export function loadConfig(env = process.env) {
  const mongoUri = env.MONGODB_URI?.trim();
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env and add your connection string.');
  }

  const port = Number(env.PORT) || DEFAULT_PORT;
  return {
    mongoUri,
    dbName: env.MONGODB_DB?.trim() || DEFAULT_DB_NAME,
    port,
  };
}
