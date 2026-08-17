import { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError';
import status from 'http-status';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            errorMessage: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        });
    }

    const statusCode = status.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
        success: false,
        message: error?.message || "Something went wrong",
        // errorMessage: error?.message,
        statusCode,
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    });
};

export default globalErrorHandler;