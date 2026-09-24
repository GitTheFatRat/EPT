import { asyncHandler } from '../utils/asyncHandler.js';
import * as userService from '../services/user.service.js';
import { AppError } from '../utils/AppError.js';

export const getMe = asyncHandler(async (req, res) => {
    const result = await userService.getMe(req.user.id);
    res.status(200).json({ success: true, data: result });
});

export const updateMe = asyncHandler(async (req, res) => {
    const result = await userService.updateMe(req.user.id, req.body);
    res.status(200).json({ success: true, data: result });
});

export const uploadAvatar = asyncHandler(async (req, res) => {
    if (!req.file) throw new AppError(400, 'NO_FILE', 'No file provided');
    const url = await userService.uploadAvatar(req.user.id, req.file.buffer, req.file.mimetype, req.file.originalname);
    res.status(200).json({ success: true, data: { url } });
});

export const uploadBanner = asyncHandler(async (req, res) => {
    if (!req.file) throw new AppError(400, 'NO_FILE', 'No file provided');
    const url = await userService.uploadBanner(req.user.id, req.file.buffer, req.file.mimetype, req.file.originalname);
    res.status(200).json({ success: true, data: { url } });
});

