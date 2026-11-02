import express from 'express';
import { createApplicationsRouter } from './routes/applications.js';
import { errorHandler, notFound } from './middleware/errors.js';

export function createApp({ applicationsRepo, ping, corsOrigins = [] }) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '32kb' }));

  app.use('/api', allowCrossOrigin(corsOrigins));

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

// Lets the Vercel-hosted client call this API directly. Requests from other origins get no CORS headers,
// so the browser blocks them.
function allowCrossOrigin(allowedOrigins) {
  return (req, res, next) => {
    const origin = req.get('Origin');
    if (origin && allowedOrigins.includes(origin)) {
      res.set('Access-Control-Allow-Origin', origin);
      res.set('Vary', 'Origin');
      res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
    }

    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  };
}
