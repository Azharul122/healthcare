import { NextFunction, Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import { doctorService } from "./doctor.service"
import sendResponse from "../../utils/sendResponse"


const getAllDoctors = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await doctorService.getAllDoctors()
    sendResponse(res, {
        message: "Doctors fetched successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})


export const doctorController = {
    getAllDoctors
}