import { verifyAccessToken } from '../security/token.js';
import { AppError } from '../utils/AppError.js';
export function requireAuth(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError(401, 'UNAUTHORIZED', 'Missing or invalid authorization header');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new AppError(401, 'UNAUTHORIZED', 'Missing token');
    }
    try {
        const payload = verifyAccessToken(token);
        req.user = {
            id: payload.userId,
            role: payload.role,
        };
        next();
    }
    catch (error) {
        next(error); // verifyAccessToken throws, caught here and passed to errorHandler
    }
}
export function requireRole(role) {
    return (req, _res, next) => {
        if (!req.user) {
            throw new AppError(401, 'UNAUTHORIZED', 'User not authenticated');
        }
        if (req.user.role !== role) {
            throw new AppError(403, 'FORBIDDEN', 'Insufficient permissions');
        }
        next();
    };
}

