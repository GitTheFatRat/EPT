import { z } from 'zod';
import { AppError } from '../utils/AppError.js';
export const startAttemptSchema = z.object({
    examId: z.string().uuid(),
    mode: z.enum(['practice_reading', 'practice_listening', 'full_test']),
});
export const autosaveSchema = z.object({
    answers: z.record(z.string(), z.unknown()),
});
export const submitAttemptSchema = z.object({
    answers: z.record(z.string(), z.unknown()).optional(),
});
export const validate = (schema) => (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        throw new AppError(400, 'VALIDATION_ERROR', result.error.issues[0]?.message || 'Validation error');
    }
    req.body = result.data;
    next();
};

