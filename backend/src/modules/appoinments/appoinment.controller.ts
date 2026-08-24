import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { appointmentService } from "./appoinments.service";
import { IRequestUser } from "../../types/user";
import sendResponse from "../../utils/sendResponse";
import { AppointmentStatus } from "../../genereted/prisma/enums";

const bookAppoinment = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body
    const user = req.user

    const result = await appointmentService.createAppoinment(payload, user as IRequestUser)
    sendResponse(res, {
        message: "Schedule created successfully",
        success: true,
        statusCode: 200,
        data: result
    })
});

const changeAppointmentStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const { status } = req.body
    const user = req.user
    const result = await appointmentService.changeAppointmentStatus(id as string, status as AppointmentStatus, user as IRequestUser)
    sendResponse(res, {
        message: "Schedule created successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})

const getMyAppointments = catchAsync(async (req: Request, res: Response) => {
    const user = req.user
    const result = await appointmentService.getMyAppointments(user as IRequestUser)
    sendResponse(res, {
        message: "Schedule created successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})

const getMySingleApointments = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const user = req.user
    const result = await appointmentService.getMySingleAppointment(id as string, user as IRequestUser)
    sendResponse(res, {
        message: "Schedule created successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})

const getAllAppointment = catchAsync(async (req: Request, res: Response) => {
    const result = await appointmentService.getAllAppointment()
    sendResponse(res, {
        message: "Schedule created successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})

const bookAppointmentWithPayLater = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body
    console.log(payload, "payload")
    const user = req.user

    const result = await appointmentService.bookAppointmentWithPayLater(payload, user as IRequestUser)
    sendResponse(res, {
        message: "Schedule created successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const user = req.user
    const result = await appointmentService.initiatePayment(id as string, user as IRequestUser)
    sendResponse(res, {
        message: "Schedule created successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})


export const appoinmentController = {
    bookAppoinment,
    changeAppointmentStatus,
    getMyAppointments,
    getMySingleApointments,
    getAllAppointment,
    bookAppointmentWithPayLater,
    initiatePayment
}