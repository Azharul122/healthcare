import { NextFunction, Request, Response } from "express";
import { CreateDoctorPayload, IChangePassword } from "../../types/user";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userService } from "./user.service";
import { setAccessTokenToCookie, setBetterAuthSessionToCookie, setRefreshTokenToCookie } from "../../utils/token";
import status from "http-status";


const createDoctor = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body

    // console.log(payload)

    const result = await userService.createDoctor(payload as CreateDoctorPayload)
    console.log(result)
    sendResponse(res, {
        message: "Doctor created successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})

const chnagePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
        const betterAuthSessionToken = req.cookies["better-auth.session_token"];

        const result = await userService.changePassword(payload, betterAuthSessionToken);

        const { accessToken, refreshToken, token } = result;

        setAccessTokenToCookie(res, accessToken);
        setRefreshTokenToCookie(res, refreshToken);
        setBetterAuthSessionToCookie(res, token as string);

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Password changed successfully",
            data: result,
        });
})

export const userController = {
    createDoctor,
    chnagePassword
}