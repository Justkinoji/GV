import mongoose from "mongoose";
import BaseService from "./BaseService";
import Review from "../models/Review";
import { authService } from "./AuthService";
import { IReview } from "../interfaces/IReview";
import {GetUserReviewsResponse, IReviewResponse, ReviewData, UserDetailForReview} from "../inputs/reviewInterfaces";

class ReviewService extends BaseService<IReview> {
    constructor() {
        super({ model: Review });
    }

    async createReview(input: ReviewData, token: string): Promise<IReviewResponse> {
        const { id: currentUserId } = await authService.verifyTokenAndGetData(token);

        const createdReview = await super.createObject({
            createdBy: new mongoose.Types.ObjectId(currentUserId),
            receivedBy: new mongoose.Types.ObjectId(input.receivedBy),
            text: input.text,
            rating: input.rating
        });

        await this.model.findById(createdReview._id)
            .populate([
                { path: 'createdBy', select: 'userName avatarURL' },
                { path: 'receivedBy', select: 'userName avatarURL' }
            ])
            .exec();

        return {
            id: createdReview._id.toString(),
            createdBy: {
                userName: createdReview.createdBy.userName,
                avatarURL: createdReview.createdBy.avatarURL
            },
            receivedBy: {
                userName: createdReview.receivedBy.userName,
                avatarURL: createdReview.receivedBy.avatarURL
            },
            text: createdReview.text,
            rating: createdReview.rating,
            createdAt: createdReview.createdAt,
            updatedAt: createdReview.updatedAt
        };
    }

    async getMyReviews(token: string): Promise<IReviewResponse[]> {
        const { id: currentUserId } = await authService.verifyTokenAndGetData(token);

        return this.model.find({ receivedBy: new mongoose.Types.ObjectId(currentUserId) })
            .populate('createdBy')
            .populate('receivedBy');
    }

    async getSentReviews(token: string): Promise<IReviewResponse[]> {
        const { id: currentUserId } = await authService.verifyTokenAndGetData(token);

        return this.model.find({ createdBy: new mongoose.Types.ObjectId(currentUserId) })
            .populate('createdBy')
            .populate('receivedBy');
    }

    async getUserReviews(id: string): Promise<GetUserReviewsResponse[]> {
        console.log('id', id);
        const reviews = await this.model.find({ receivedBy: new mongoose.Types.ObjectId(id) })
            .populate('createdBy')
            .populate('receivedBy').exec();

        const transformedReviews = reviews.map(async review => {
            const createdBy = await this.mapUserDetails(review.createdBy);
            const receivedBy = await this.mapUserDetails(review.receivedBy);

            return {
                id: review._id.toString(),
                createdBy,
                receivedBy,
                text: review.text,
                rating: review.rating,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt
            };
        });

        return Promise.all(transformedReviews);
    }

    private async mapUserDetails(user: any): Promise<UserDetailForReview> {

        return {
            id: user._id.toString(),
            userName: user.userName,
            avatarURL: user.avatarURL
        };
    }
}

export default new ReviewService();
