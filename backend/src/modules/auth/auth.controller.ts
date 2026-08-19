/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { authService } from "./auth.service"
import { setAccessTokenToCookie, setBetterAuthSessionToCookie, setRefreshTokenToCookie } from "../../utils/token"
import { AppError } from "../../errors/AppError"
import status from "http-status"
import envConfig from "../../configs/envConfig"
import { auth } from "../../lib/auth"



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

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { userId } = req.user as any
    console.log(req, "req.user")
    const result = await authService.getMe(userId)
    sendResponse(res, {
        message: "User fetched successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})

const getNewAccessToken = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const refreshToekn = req.cookies.refreshToken
        const better_auth_session = req.cookies["betterAuth.session_token"]

        if (!refreshToekn) {
            return new AppError(status.NOT_FOUND, "Refresh token not found")
        }

        if (!better_auth_session) {
            return new AppError(status.NOT_FOUND, "Session token not found")
        }

        const result = await authService.getNewAccessToken(refreshToekn, better_auth_session)

        const { newAccessToken, newRefreshToken, token, ...rest } = result

        setAccessTokenToCookie(res, newAccessToken)
        setRefreshTokenToCookie(res, newRefreshToken)
        setBetterAuthSessionToCookie(res, token)
        sendResponse(res, {
            message: "Token refreshed successfully",
            success: true,
            statusCode: 200,
            data: {
                token,
                newAccessToken,
                newRefreshToken,
                ...rest
            }
        })
    }
)

const verifyEmailOtp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body
    const result = await authService.verifyEmailOtp(email, otp)
    sendResponse(res, {
        message: "Email verified successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})

// forgot password

const forgotPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body

        const result = await authService.forgotPassword(email)

        sendResponse(res, {
            message: "Otp send your mail please check and veirfy",
            success: true,
            statusCode: status.OK,
            data: result
        })
    }
)

const resetPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, otp, password } = req.body
        const result = await authService.resetPassword(email, otp, password)

           sendResponse(res, {
            message: "Password reseted successfully",
            success: true,
            statusCode: status.OK,
            data: result
        })
    }
)

// /api/v1/auth/login/google?redirect=/profile
const googleLogin = catchAsync((req: Request, res: Response) => {
    const redirectPath = req.query.redirect || "/dashboard";

    const encodedRedirectPath = encodeURIComponent(redirectPath as string);

    const callbackURL = `${envConfig.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;

    res.render("googleRedirect", {
        callbackURL : callbackURL,
        betterAuthUrl : envConfig.BETTER_AUTH_URL,
    })
})

const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
    const redirectPath = req.query.redirect as string || "/dashboard";

    const sessionToken = req.cookies["better-auth.session_token"];

    if(!sessionToken){
        return res.redirect(`${envConfig.FRONTEND_URL}/login?error=oauth_failed`);
    }

    const session = await auth.api.getSession({
        headers:{
            "Cookie" : `better-auth.session_token=${sessionToken}`
        }
    })

    if (!session) {
        return res.redirect(`${envConfig.FRONTEND_URL}/login?error=no_session_found`);
    }


    if(session && !session.user){
        return res.redirect(`${envConfig.FRONTEND_URL}/login?error=no_user_found`);
    }

    const result = await authService.googleLoginSuccess(session);

    const {accessToken, refreshToken} = result;

    setAccessTokenToCookie(res, accessToken);
    setRefreshTokenToCookie(res, refreshToken);
 // ?redirect=//profile -> /profile
    const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
    const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";

    res.redirect(`${envConfig.FRONTEND_URL}${finalRedirectPath}`);
})

const handleOAuthError = catchAsync((req: Request, res: Response) => {
    const error = req.query.error as string || "oauth_failed";
    res.redirect(`${envConfig.FRONTEND_URL}/login?error=${error}`);
})


export const authController = {
    register,
    login,
    getMe,
    getNewAccessToken,
    verifyEmailOtp,
    forgotPassword,
    resetPassword,
    googleLogin,
    googleLoginSuccess,
    handleOAuthError
}