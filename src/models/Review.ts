import mongoose, { Schema } from "mongoose";
import { Rating, ratingValues } from "../constants/Rating";
import { IReview } from "../interfaces/IReview";

const reviewSchema: Schema = new Schema<IReview>({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receivedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: String,
    rating: {
        type: Number,
        enum: ratingValues,
        default: Rating.One
    },
    },
    {
        timestamps: true,
        versionKey: false,
        collection: 'reviews'
});

const Review = mongoose.model<IReview, mongoose.Model<IReview>>("Review", reviewSchema);
export default Review;
