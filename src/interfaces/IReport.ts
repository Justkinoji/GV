import mongoose, { Document } from "mongoose";

export interface IReport extends Document {
    reporterId: mongoose.Types.ObjectId;
    suspectId?: mongoose.Types.ObjectId;
    targetType: 'user' | 'website';
    reportText: string;
    imageUrl?: string;
    isReviewed?: boolean;
    answerReporterText?: string;
    answerSuspectText: string;

    createdAt: Date;
    updatedAt: Date;
}