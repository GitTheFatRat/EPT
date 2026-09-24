import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
export const signAccessToken = (payload) => {
    return jwt.sign({ ...payload }, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    });
};
export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, env.JWT_ACCESS_SECRET);
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError(401, 'TOKEN_EXPIRED', 'Token has expired');
        }
        throw new AppError(401, 'UNAUTHORIZED', 'Invalid token');
    }
};
export const signRefreshToken = (payload) => {
    return jwt.sign({ ...payload }, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });
};
export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, env.JWT_REFRESH_SECRET);
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError(401, 'TOKEN_EXPIRED', 'Token has expired');
        }
        throw new AppError(401, 'UNAUTHORIZED', 'Invalid token');
    }
};
export const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

