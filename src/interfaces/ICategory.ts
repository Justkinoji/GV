import { Types , Document } from "mongoose";

export interface ICategory extends Document {
    _id: Types.ObjectId;
    name: string;
    sectionId: Types.ObjectId;
    fee: number;
    products: Types.ObjectId[];
}
