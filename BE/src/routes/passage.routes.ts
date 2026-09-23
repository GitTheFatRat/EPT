import { Router } from 'express';
import { validate } from '../validators/auth.validator.js';
import { addQuestionsSchema } from '../validators/exam.validator.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import * as examController from '../controllers/exam.controller.js';

const router = Router({ mergeParams: true });

router.post('/:id/questions', requireAuth, requireRole('admin'), validate(addQuestionsSchema), examController.addQuestions);

export default router;
