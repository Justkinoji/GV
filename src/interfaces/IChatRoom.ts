import { Types, Document } from "mongoose";

export interface IChatRoom extends Document {
    _id: Types.ObjectId;
    members: Types.ObjectId[];
    lastMessage: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}