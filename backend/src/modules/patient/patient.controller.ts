import { IUpdatePatientProfilePayload } from './patient.interface';
import { IRequestUser } from "../../types/user";
import catchAsync from "../../utils/catchAsync";
import { patientService } from "./patient.service";
import sendResponse from '../../utils/sendResponse';
import { Request, Response } from 'express';


const updatePatientProfile = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body
    const user = req.user
    const result = await patientService.updateMyProfile(user as IRequestUser, payload as IUpdatePatientProfilePayload)
    sendResponse(res, {
        message: "Patient profile updated successfully",
        success: true,
        statusCode: 200,
        data: result
    })
})


export const patientController = {
    updatePatientProfile
}