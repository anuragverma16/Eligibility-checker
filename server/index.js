import { createApp } from './app.js';
import { loadConfig } from './config/env.js';
import { connectDatabase } from './db/connect.js';
import { createApplicationsRepository } from './repositories/applicationsRepository.js';

const config = loadConfig();
const { client, db } = await connectDatabase(config);

const app = createApp({
  applicationsRepo: createApplicationsRepository(db),
  ping: () => db.command({ ping: 1 }),
});

const server = app.listen(config.port, () => {
  console.log(`Grantwise API listening on http://localhost:${config.port} (database: ${config.dbName})`);
});

async function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close();
  await client.close();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
