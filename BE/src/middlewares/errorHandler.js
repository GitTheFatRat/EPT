import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

export const errorHandler = (err, _req, res, _next) => {
    let statusCode = 500;
    let code = 'INTERNAL_ERROR';
    let message = 'An unexpected error occurred.';
    let debug;

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        code = err.code;
        message = err.message;
    } else if (err.name === 'MulterError' && err.code === 'LIMIT_FILE_SIZE') {
        statusCode = 400;
        code = 'FILE_TOO_LARGE';
        message = 'File size exceeds the 5MB limit';
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

