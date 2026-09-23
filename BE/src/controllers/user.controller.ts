import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as userService from '../services/user.service.js';

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getMe(req.user!.id);
  res.status(200).json({ success: true, data: result });
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.updateMe(req.user!.id, req.body);
  res.status(200).json({ success: true, data: result });
});
