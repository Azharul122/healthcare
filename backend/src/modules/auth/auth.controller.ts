import { NextFunction, Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { authService } from "./auth.service"
import { setAccessTokenToCookie, setBetterAuthSessionToCookie, setRefreshTokenToCookie } from "../../utils/token"



const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body

    const result = await authService.register({ name, email, password })
    sendResponse(res, {
        message: "User registered successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body


    const result = await authService.login(email, password)

    const { accessToken, refreshToken, token, ...rest } = result

    setAccessTokenToCookie(res, accessToken)
    setRefreshTokenToCookie(res, refreshToken)
    setBetterAuthSessionToCookie(res, token)

    sendResponse(res, {
        message: "User logged in successfully",
        success: true,
        statusCode: 200,
        data: {
            token,
            accessToken,
            refreshToken,
            ...rest
        }
    })
})

export const authController = {
    register,
    login
}