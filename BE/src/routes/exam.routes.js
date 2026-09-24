import { Router } from 'express';
import multer from 'multer';
import { validate } from '../validators/auth.validator.js';
import { createExamSchema, updateExamSchema, addPassageSchema } from '../validators/exam.validator.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import * as examController from '../controllers/exam.controller.js';
const upload = multer({ storage: multer.memoryStorage() });
const router = Router();
router.get('/', examController.listExams);
router.get('/:code', examController.getExamByCode);
router.post('/', requireAuth, requireRole('admin'), validate(createExamSchema), examController.createExam);
router.patch('/:id', requireAuth, requireRole('admin'), validate(updateExamSchema), examController.updateExam);
router.delete('/:id', requireAuth, requireRole('admin'), examController.deleteExam);
router.post('/:id/passages', requireAuth, requireRole('admin'), upload.single('audioFile'), validate(addPassageSchema), examController.addPassage);
export default router;

