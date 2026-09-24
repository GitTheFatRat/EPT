import { asyncHandler } from '../utils/asyncHandler.js';
import * as resultService from '../services/result.service.js';
export const listResults = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await resultService.listResults(userId, page, limit);
    res.status(200).json({ success: true, data: result });
});
export const getResultById = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    const resultId = req.params.id;
    const result = await resultService.getResultById(resultId, userId, role);
    res.status(200).json({ success: true, data: result });
});
export const getStats = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await resultService.getStats(userId);
    res.status(200).json({ success: true, data: result });
});

