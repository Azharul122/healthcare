/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { specialityService } from "./speciality.service"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { send } from "node:process"


const createSpecialities = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { title, description } = req.body



    const icon = req?.file?.path

    const data = {
        title,
        description,
        icon: icon as string
    }
    const speciality = await specialityService.createSpeciality(data)

    sendResponse(res, {
        message: "Speciality created successfully",
        success: true,
        statusCode: 200,
        data: speciality
    })
}
)



const getAllSpeciality = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const speciality = await specialityService.getAllSpeciality()
    sendResponse(res, {
        message: "Speciality fetched successfully",
        success: true,
        statusCode: 200,
        data: speciality
    })
})



const updateSpeciality = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        const { title, description } = req.body
        const data = {
            title,
            description
        }

        const speciality = await specialityService.updateSpeciality(id as string, data)
        sendResponse(res, {
            message: "Speciality updated successfully",
            success: true,
            statusCode: 200,
            data: speciality
        })
    }
)

const deleteSpeciality = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        await specialityService.deleteSpeciality(id as string)

        sendResponse(res, {
            message: "Speciality deleted successfully",
            success: true,
            statusCode: 200,
            data: null
        })

    }
)

// ...................... get single speciality ......................
const getSingleSpeciality = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params

        if (!id) {
            sendResponse(res, {
                message: "Speciality id is required",
                success: false,
                statusCode: 400
            })
        }
        const speciality = await specialityService.getSingleSpeciality(id as string)

        sendResponse(res, {
            message: "Speciality fetched successfully",
            success: true,
            statusCode: 200,
            data: speciality
        })

    }
)


// ...................... Export ......................
export const specialityController = {
    createSpecialities,
    updateSpeciality,
    getAllSpeciality,
    deleteSpeciality,
    getSingleSpeciality
}