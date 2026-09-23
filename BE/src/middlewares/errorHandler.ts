import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred.';
  let debug: string | undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  if (env.NODE_ENV === 'development' && err instanceof Error) {
    debug = err.stack;
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(debug && { debug })
    }
  });
};
