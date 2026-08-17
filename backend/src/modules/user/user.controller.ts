import { NextFunction, Request, Response } from "express";
import { CreateDoctorPayload } from "../../types/user";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userService } from "./user.service";


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

export const userController = {
    createDoctor
}