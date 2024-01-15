import mongoose from 'mongoose';
import { IAchievement } from "../interfaces/IAchievement";

const AchievementSchema = new mongoose.Schema<IAchievement>({
    name:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    criteria: [{
        field: String,
        count: Number
    }],
    bonusPoints: Number
},
{
    timestamps: true,
    versionKey: false,
    collection: 'achievements',
});

const Achievement = mongoose.model<IAchievement, mongoose.Model<IAchievement>>('Achievement', AchievementSchema);
export default Achievement;