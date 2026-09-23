import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import * as attemptController from '../controllers/attempt.controller.js';
import { validate, startAttemptSchema, autosaveSchema, submitAttemptSchema } from '../validators/attempt.validator.js';

const router = Router();

router.use(requireAuth);

router.post('/start', validate(startAttemptSchema), attemptController.startAttempt);
router.post('/:id/advance-segment', attemptController.advanceSegment);
router.patch('/:id/autosave', validate(autosaveSchema), attemptController.autosave);
router.post('/:id/submit', validate(submitAttemptSchema), attemptController.submitAttempt);
router.get('/:id', attemptController.getAttempt);

export default router;
