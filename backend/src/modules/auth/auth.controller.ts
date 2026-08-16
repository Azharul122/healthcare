import { NextFunction, Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { authService } from "./auth.service"


const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body

    const result = await authService.register({ name, email, password  })
    sendResponse(res, {
        message: "User registered successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})

export const authController = {
    register
}