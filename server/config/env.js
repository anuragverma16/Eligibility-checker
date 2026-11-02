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
    corsOrigins: parseOrigins(env.CORS_ORIGIN),
  };
}

// CORS_ORIGIN is a comma-separated list, e.g. "https://app.vercel.app,http://localhost:5173".
// Empty means no cross-origin browser access (local dev uses the Vite proxy instead).
function parseOrigins(value) {
  return (value ?? '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);
}
