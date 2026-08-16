
import { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError';


const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            error
        });
    }

    return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error
    });
};

export default globalErrorHandler;