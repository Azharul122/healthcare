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

const getReviews = catchAsync(
    async (req: Request, res: Response) => {
   
        const result = await reviewService.getAllReviews();
        res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            data: result
        });
    }
)

const getmyReviews = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user;
        const result = await reviewService.getmyReviews(user as IRequestUser);
        res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            data: result
        });
    }
)



export const reviewController = {
    giveReview,
    getReviews,
    getmyReviews
}