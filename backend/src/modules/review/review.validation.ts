import z from "zod";


const createReviewSchema = z.object({
    appointmentId: z.string().min(1, "Doctor ID is required"),
    rating: z.number().min(1, "Rating must be at least 1"),
    comment: z.string().min(1, "Comment is required"),
});

const updateReviewSchema = z.object({
    rating: z.number().min(1, "Rating must be at least 1"),
    comment: z.string().min(1, "Comment is required"),
});

export const ReviewValidation = {
    createReviewSchema,
    updateReviewSchema,
};

