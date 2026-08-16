import { Response } from "express"

interface SendResponse<T> {
    success: boolean,
    message: string,
    statusCode: number,
    data?: T
}

const sendResponse = <T>(res: Response, { message, success, statusCode, data }: SendResponse<T>) => {
    return res.status(statusCode).json({
        success,
        message,
        statusCode,
        data
    })
}

export default sendResponse