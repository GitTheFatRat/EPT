import { z } from 'zod';
import { AppError } from '../utils/AppError.js';
export const registerSchema = z.object({
    username: z
        .string()
        .min(3)
        .max(50)
        .regex(/^[a-zA-Z0-9_]+$/, 'Username must contain only letters, numbers, and underscores'),
    email: z.string().email(),
    password: z.string().min(8),
});
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
export const refreshSchema = z.object({
    refreshToken: z.string().min(1),
});
export const logoutSchema = z.object({
    refreshToken: z.string().min(1),
});
export const updateProfileSchema = z.object({
    avatarUrl: z.string().url().optional(),
    bannerUrl: z.string().url().optional(),
    description: z.string().optional(),
    targetBand: z.number().min(0).max(9).multipleOf(0.5).optional(),
    studyType: z.enum(['academic', 'general_training']).optional(),
});
export const validate = (schema) => (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        throw new AppError(400, 'VALIDATION_ERROR', result.error.issues[0]?.message || 'Validation error');
    }
    req.body = result.data;
    next();
};

