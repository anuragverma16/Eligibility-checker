import { createApp } from './app.js';
import { loadConfig } from './config/env.js';
import { connectDatabase } from './db/connect.js';
import { createApplicationsRepository } from './repositories/applicationsRepository.js';

const config = loadConfig();

let client;
let db;
try {
  ({ client, db } = await connectDatabase(config));
} catch (error) {
  // Exit with a readable message so Render's logs show the cause instead of a stack trace.
  console.error(`Could not connect to MongoDB (database: ${config.dbName}): ${error.message}`);
  process.exit(1);
}

const app = createApp({
  applicationsRepo: createApplicationsRepository(db),
  ping: () => db.command({ ping: 1 }),
  corsOrigins: config.corsOrigins,
});

// Bind to all interfaces explicitly so Render's router can reach the service.
const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`Grantwise API listening on port ${config.port} (database: ${config.dbName})`);
});

async function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close();
  await client.close();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
