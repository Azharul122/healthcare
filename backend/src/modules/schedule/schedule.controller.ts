import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { scheduleService } from "./shcedule.service";
import { IQueryParams } from "../../types/query";

const createSchedule = catchAsync( async (req : Request, res : Response) => {
    const payload = req.body;
    console.log(payload)
    const schedule = await scheduleService.createSchedule(payload);
    sendResponse(res, {
        success: true,
        statusCode: status.CREATED,
        message: 'Schedule created successfully',
        data: schedule
    });
});

const getAllSchedules = catchAsync( async (req : Request, res : Response) => {
    const query = req.query;
    const result = await scheduleService.getAllSchedules(query as IQueryParams);
    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: 'Schedules retrieved successfully',
        data: result.data,
        meta: result.meta
    });
});

const updateSchedule = catchAsync( async (req : Request, res : Response) => {
        const payload = req.body;
        const {id}= req.params 
        const schedule = await scheduleService.updateSchedule(id as string,payload);
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: 'Schedule updated successfully',
            data: schedule
        });
});

const deleteSchedule = catchAsync( async (req : Request, res : Response) => {
        const {id}= req.params 
        const schedule = await scheduleService.deleteSchedule(id as string);
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: 'Schedule deleted successfully',
            data: schedule
        });
});

export const ScheduleController = {
    createSchedule,
    getAllSchedules,
    updateSchedule,
    deleteSchedule
}