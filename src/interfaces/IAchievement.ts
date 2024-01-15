import { Document } from "mongoose";

export interface IAchievement extends Document {
    name: string;
    image: string;
    description: string;
    criteria: { field: string; count: number }[];
    bonusPoints: number;
}