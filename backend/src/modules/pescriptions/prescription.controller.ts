import { IRequestUser } from "../../types/user";
import catchAsync from "../../utils/catchAsync";
import { prescriptionService } from "./prescription.service";


const givePrescription= catchAsync(async (req, res) => {
    const user = req.user;
    const payload = req.body;
    const result = await prescriptionService.givePrescription(user as IRequestUser, payload);
    res.status(201).json({
        success: true,
        message: "Prescription given successfully",
        data: result
    });
});


const myPrescriptions = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await prescriptionService.myPrescriptions(user as IRequestUser);
    res.status(200).json({
        success: true,
        message: "Prescriptions fetched successfully",
        data: result
    });
});


export const prescriptionController = {
    givePrescription,
    myPrescriptions
}