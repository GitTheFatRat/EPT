import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { validate, updateProfileSchema } from '../validators/auth.validator.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.patch('/me', requireAuth, validate(updateProfileSchema), userController.updateMe);

export default router;
