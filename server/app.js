import express from 'express';
import { createApplicationsRouter } from './routes/applications.js';
import { errorHandler, notFound } from './middleware/errors.js';

export function createApp({ applicationsRepo, ping }) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '32kb' }));

  app.get('/api/health', async (_req, res) => {
    try {
      await ping();
      res.json({ ok: true, database: 'up' });
    } catch {
      res.status(503).json({ ok: false, database: 'down' });
    }
  });

  app.use('/api/applications', createApplicationsRouter(applicationsRepo));
  app.use('/api', notFound);
  app.use(errorHandler);

  return app;
}
