import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { validate, updateProfileSchema } from '../validators/auth.validator.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import multer from 'multer';
import { AppError } from '../utils/AppError.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(400, 'INVALID_FILE_TYPE', 'Only JPG, PNG and WEBP images are allowed'));
    }
  }
});

const router = Router();
router.patch('/me', requireAuth, validate(updateProfileSchema), userController.updateMe);
router.post('/me/avatar', requireAuth, upload.single('image'), userController.uploadAvatar);
router.post('/me/banner', requireAuth, upload.single('image'), userController.uploadBanner);
export default router;

