import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { reviewService } from "./review.service";
import { IRequestUser } from "../../types/user";


const giveReview = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user;
        const payload = req.body;

        const result = await reviewService.giveReview(user as IRequestUser, payload);

        res.status(201).json({
            success: true,
            message: "Review given successfully",
            data: result
        });
    }

)



export const reviewController = {
    giveReview
}