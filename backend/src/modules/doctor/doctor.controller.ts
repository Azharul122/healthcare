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

const getSingleDoctor = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const result = await doctorService.getSingleDoctor(id as string)
    sendResponse(res, {
        message: "Doctor fetched successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})

const updateDoctor = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const payload = req.body
    const result = await doctorService.updateDoctor(id as string, payload)
    sendResponse(res, {
        message: "Doctor updated successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})

const deleteDoctor = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const result = await doctorService.deleteDoctor(id as string)
    sendResponse(res, {
        message: "Doctor deleted successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})


export const doctorController = {
    getAllDoctors
    , getSingleDoctor
    , updateDoctor
    , deleteDoctor
}