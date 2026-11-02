import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../config/env.js';
import { createApp } from '../app.js';

const baseEnv = { MONGODB_URI: 'mongodb://localhost:27017' };

test('parses a comma-separated CORS_ORIGIN list and drops trailing slashes', () => {
  const config = loadConfig({ ...baseEnv, CORS_ORIGIN: 'https://app.vercel.app/, http://localhost:5173' });
  assert.deepEqual(config.corsOrigins, ['https://app.vercel.app', 'http://localhost:5173']);
});

test('no CORS origins when CORS_ORIGIN is unset', () => {
  assert.deepEqual(loadConfig(baseEnv).corsOrigins, []);
});

test('allows only listed origins and answers preflight requests', async () => {
  const app = createApp({
    applicationsRepo: {},
    ping: async () => {},
    corsOrigins: ['https://app.vercel.app'],
  });
  const server = app.listen(0);
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}/api/health`;

  try {
    const allowed = await fetch(base, { headers: { Origin: 'https://app.vercel.app' } });
    assert.equal(allowed.headers.get('access-control-allow-origin'), 'https://app.vercel.app');

    const blocked = await fetch(base, { headers: { Origin: 'https://evil.example' } });
    assert.equal(blocked.headers.get('access-control-allow-origin'), null);

    const preflight = await fetch(`http://127.0.0.1:${port}/api/applications`, {
      method: 'OPTIONS',
      headers: { Origin: 'https://app.vercel.app', 'Access-Control-Request-Method': 'POST' },
    });
    assert.equal(preflight.status, 204);
    assert.match(preflight.headers.get('access-control-allow-methods'), /POST/);
  } finally {
    server.close();
  }
});
