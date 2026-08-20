import { Response } from "express"

interface SendResponse<T> {
    success: boolean,
    message: string,
    statusCode: number,
    data?: T
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }
}

const sendResponse = <T>(res: Response, { message, success, statusCode, data, meta }: SendResponse<T>) => {
    return res.status(statusCode).json({
        success,
        message,
        statusCode,
        data,
        meta
    })
}

export default sendResponse