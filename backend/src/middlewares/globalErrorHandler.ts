
import { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError';
import status from 'http-status';


const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            error
        });
    }

    let statusCode = status.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
        success: false,
        message: "Something went wrong",
        error
    });
};

export default globalErrorHandler;