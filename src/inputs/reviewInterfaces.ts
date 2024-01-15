import { Rating } from "../constants/Rating";

interface ReviewData {
    receivedBy: string;
    text?: string;
    rating: Rating;
}

interface IReviewResponse {
    id: string;
    createdBy: UserDetail;
    receivedBy: UserDetail;
    text?: string;
    rating: Rating;
    createdAt?: Date;
    updatedAt?: Date;
}

interface GetUserReviewsResponse {
    id: string;
    createdBy: UserDetailForReview;
    receivedBy: UserDetailForReview;
    text?: string;
    rating: Rating;
    createdAt?: Date;
    updatedAt?: Date;
}

interface UserDetail {
    userName?: string;
    avatarURL?: string;
}

interface UserDetailForReview {
    id: string;
    userName?: string;
    avatarURL?: string;
}

export { ReviewData, IReviewResponse, GetUserReviewsResponse, UserDetailForReview };
