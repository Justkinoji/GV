import mongoose, { Document } from "mongoose";
import { ILanguageMap } from "./ILanguageMap";
import { Platform } from "../constants/Platform";

export interface IProduct extends Document {
    createdBy: mongoose.Types.ObjectId;
    price: number;
    imageUrl: string;
    stripePriceId: string;
    categoryId: mongoose.Types.ObjectId;
    sectionId: mongoose.Types.ObjectId;
    description: ILanguageMap;
    shortDescription: ILanguageMap;
    platform: Platform;
    server: string;
    sold: boolean;
    quantity: number;
}
