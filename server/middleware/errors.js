export function notFound(_req, res) {
  res.status(404).json({ error: 'Not found.' });
}

export function errorHandler(error, _req, res, _next) {
  // Malformed or oversized JSON bodies are client errors, not server faults.
  if (error.type === 'entity.parse.failed' || error.type === 'entity.too.large') {
    return res.status(error.status ?? 400).json({ error: 'Invalid request body.' });
  }

  console.error('Unhandled API error', error);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
}
