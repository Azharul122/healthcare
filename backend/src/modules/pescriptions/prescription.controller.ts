import { IRequestUser } from "../../types/user";
import catchAsync from "../../utils/catchAsync";
import { pescriptionService } from "./prescription.service";


const givePrescription= catchAsync(async (req, res) => {
    const user = req.user;
    const payload = req.body;
    const result = await pescriptionService.givePrescription(user as IRequestUser, payload);
    res.status(201).json({
        success: true,
        message: "Pescription given successfully",
        data: result
    });
});


export const pescriptionController = {
    givePrescription
}