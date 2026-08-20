import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { scheduleService } from "./shcedule.service";

const createSchedule = catchAsync( async (req : Request, res : Response) => {
    const payload = req.body;
    const schedule = await scheduleService.createSchedule(payload);
    sendResponse(res, {
        success: true,
        statusCode: status.CREATED,
        message: 'Schedule created successfully',
        data: schedule
    });
});

export const ScheduleController = {
    createSchedule
}