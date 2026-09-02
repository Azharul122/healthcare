import { Router } from "express";
import { reviewController } from "./review.controller";

const router = Router()

router.post('/give-review', reviewController.giveReview)
router.get('/reviews', reviewController.getReviews)
router.get('/my-reviews', reviewController.getmyReviews)

export const reviewRouter = router