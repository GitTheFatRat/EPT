import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../security/token.js';
import { AppError } from '../utils/AppError.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
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
  } catch (error) {
    next(error); // verifyAccessToken throws, caught here and passed to errorHandler
  }
}

export function requireRole(role: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHORIZED', 'User not authenticated');
    }
    if (req.user.role !== role) {
      throw new AppError(403, 'FORBIDDEN', 'Insufficient permissions');
    }
    next();
  };
}
