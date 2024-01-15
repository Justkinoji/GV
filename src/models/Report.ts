import mongoose, { Schema } from 'mongoose';
import { IReport } from "../interfaces/IReport";
import { TargetTypes } from "../constants/TargetTypes";

const reportSchema = new mongoose.Schema<IReport>({
    reporterId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    suspectId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    targetType: {
        type: String,
        enum: Object.values(TargetTypes),
        required: true,
    },
    reportText: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String
    },
    isReviewed: {
        type: Boolean,
        default: false,
    },
    answerReporterText: {
        type: String,
    },
    answerSuspectText: {
        type: String
    },
}, {
    timestamps: true,
    versionKey: false,
    collection: 'reports',
});

const Report = mongoose.model<IReport, mongoose.Model<IReport>>('Report', reportSchema);

export default Report;
