import { NextFunction, Request, Response, RequestHandler } from "express";

const catchAsync = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            return res.status(500).json(
                {
                    success: false,
                    message: "Something went wrong",
                    error
                }
            )
        }
    };
};

export default catchAsync;