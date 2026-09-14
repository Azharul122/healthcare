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

const getAllPrescriptions = catchAsync(async (req, res) => {
    const result = await prescriptionService.getAllPrescriptions();
    res.status(200).json({
        success: true,
        message: "Prescriptions fetched successfully",
        data: result
    });
});


const updatePrescription = catchAsync(async (req, res) => {
    const user = req.user;
    const prescriptionId = req.params.id;
    const payload = req.body;
    const result = await prescriptionService.updatePrescription(user as IRequestUser, prescriptionId as string, payload);
    res.status(200).json({
        success: true,
        message: "Prescription updated successfully",
        data: result
    });
});

const deletePrescription = catchAsync(async (req, res) => {
    const user = req.user;
    const prescriptionId = req.params.id;
    const result = await prescriptionService.deletePrescription(user as IRequestUser, prescriptionId as string);
    res.status(200).json({
        success: true,
        message: "Prescription deleted successfully",
        data: result
    });
});

export const prescriptionController = {
    givePrescription,
    myPrescriptions,
    getAllPrescriptions,
    updatePrescription,
    deletePrescription
}   
   