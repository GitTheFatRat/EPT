import { asyncHandler } from '../utils/asyncHandler.js';
import * as attemptService from '../services/attempt.service.js';
export const startAttempt = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await attemptService.startAttempt(req.body, userId);
    res.status(201).json({ success: true, data: result });
});
export const advanceSegment = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const attemptId = req.params.id;
    const result = await attemptService.advanceSegment(attemptId, userId);
    res.status(200).json({ success: true, data: result });
});
export const autosave = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const attemptId = req.params.id;
    await attemptService.autosave(attemptId, req.body, userId);
    res.status(200).json({ success: true, data: null });
});
export const submitAttempt = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const attemptId = req.params.id;
    const result = await attemptService.submitAttempt(attemptId, req.body, userId);
    res.status(200).json({ success: true, data: result });
});
export const getAttempt = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const attemptId = req.params.id;
    const result = await attemptService.getAttemptById(attemptId, userId);
    res.status(200).json({ success: true, data: result });
});

