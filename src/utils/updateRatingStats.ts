import mongoose from "mongoose";
import Review from "../models/Review";
import User from "../models/User";
import { Rating } from "../constants/Rating";
import { IReview } from "../interfaces/IReview";

async function updateRatingStats(userId: mongoose.Types.ObjectId): Promise<void> {
    const reviews = await Review.find({ receivedBy: userId }) as IReview[];
    const totalReviews = reviews.length;

    const initialStats = Object.fromEntries(
        Object.values(Rating).filter(value => typeof value === 'number').map(value => [value, 0])
    );

    const absoluteStats = reviews.reduce((acc, review) => {
        acc[review.rating] += 1;
        return acc;
    }, initialStats);

    const statsInPercentage = Object.fromEntries(
        Object.entries(absoluteStats).map(([key, value]) => [key, (value / totalReviews) * 100])
    );

    await User.findByIdAndUpdate(userId, { ratingsStats: statsInPercentage });
}

export default updateRatingStats;
