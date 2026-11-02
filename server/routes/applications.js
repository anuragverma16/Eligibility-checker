import { Router } from 'express';
import { REFERENCE_PATTERN, validateApplication } from '../validation/application.js';

export function createApplicationsRouter(applicationsRepo) {
  const router = Router();

  router.post('/', async (req, res) => {
    const result = validateApplication(req.body);
    if (!result.ok) return res.status(400).json({ error: result.error });

    const saved = await applicationsRepo.upsert(result.value);
    res.status(201).json(saved);
  });

  router.get('/:referenceId', async (req, res) => {
    const { referenceId } = req.params;
    if (!REFERENCE_PATTERN.test(referenceId)) {
      return res.status(400).json({ error: 'Invalid reference ID.' });
    }

    const application = await applicationsRepo.findByReference(referenceId);
    if (!application) return res.status(404).json({ error: 'Application not found.' });
    res.json(application);
  });

  return router;
}
