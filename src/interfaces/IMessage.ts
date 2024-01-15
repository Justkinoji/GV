import mongoose, { Document } from "mongoose";
import { IPopulatedUser } from "../inputs/messageMutationTypes";

export interface IMessage extends Document {
    chatRoom: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId | IPopulatedUser;
    content: string;
    seenBy: (mongoose.Types.ObjectId | IPopulatedUser)[];
    createdAt: Date;
    updatedAt: Date;
}