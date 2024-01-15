import mongoose, { Document } from "mongoose";
import { Rating } from "../constants/Rating";

export interface IReview extends Document {
    createdBy: mongoose.Types.ObjectId;
    receivedBy: mongoose.Types.ObjectId;
    text?: string;
    rating: Rating;
    createdAt?: Date;
    updatedAt?: Date;
}