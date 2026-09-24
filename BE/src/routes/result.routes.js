import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import * as resultController from '../controllers/result.controller.js';
const router = Router();
router.use(requireAuth);
router.get('/stats', resultController.getStats);
router.get('/', resultController.listResults);
router.get('/:id', resultController.getResultById);
export default router;

