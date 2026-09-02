
interface ICreateReviewPayload {
    appointmentId: string;
    rating: number;
    comment: string;
}

interface IUpdateReviewPayload {
    rating: number;
    comment: string;
}

export {
    ICreateReviewPayload,
    IUpdateReviewPayload
}