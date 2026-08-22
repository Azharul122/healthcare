import { IRequestUser } from './../../types/user';
import { Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import { doctorService } from "./doctor.service"
import sendResponse from "../../utils/sendResponse"
import { IQueryParams } from '../../types/query';
import status from 'http-status';


const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
    const result = await doctorService.getAllDoctors()
    sendResponse(res, {
        message: "Doctors fetched successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})

const getSingleDoctor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await doctorService.getSingleDoctor(id as string)
    sendResponse(res, {
        message: "Doctor fetched successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
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

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await doctorService.deleteDoctor(id as string)
    sendResponse(res, {
        message: "Doctor deleted successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})


const createDoctorShedules = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body
    const user = req.user
    console.log(user, "user")
    const result = await doctorService.createSchedule(user as IRequestUser, payload)
    sendResponse(res, {
        message: "Schedule created successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})

const getMeSchedules = catchAsync(async (req: Request, res: Response) => {
    const user = req.user
    const query = req.query
    const result = await doctorService.getMyDoctorSchedules(user as IRequestUser, query as IQueryParams)
    sendResponse(res, {
        message: "Schedule created successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})

const getAllDoctorSchedules = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await doctorService.getAllDoctorSchedules(query as IQueryParams)
    sendResponse(res, {
        message: "Schedule created successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})

const getDoctorScheduleById = catchAsync(async (req: Request, res: Response) => {
    const doctorId = req.params.doctorId;
    const scheduleId = req.params.scheduleId;
    const doctorSchedule = await doctorService.getDoctorScheduleById(doctorId as string, scheduleId as string);
    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: 'Doctor schedule retrieved successfully',
        data: doctorSchedule
    });
});


const deleteDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const user = req.user
    const result = await doctorService.deleteMyDoctorSchedule(id as string, user as IRequestUser)
    sendResponse(res, {
        message: "Schedule deleted successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})

const updateMyDoctorSchedule = catchAsync( async (req : Request, res : Response) => {
    const payload = req.body;
    const user = req.user;
    const updatedDoctorSchedule = await doctorService.updateSchedule(user as IRequestUser, payload );
    sendResponse(res, {
        success: true,
        statusCode: status.OK,  
        message: 'Doctor schedule updated successfully',
        data: updatedDoctorSchedule
    });
});


export const doctorController = {
    getAllDoctors
    , getSingleDoctor
    , updateDoctor
    , deleteDoctor,
    createDoctorShedules,
    getMeSchedules
    , getAllDoctorSchedules,
    getDoctorScheduleById,
    deleteDoctorSchedule,
    updateMyDoctorSchedule
}