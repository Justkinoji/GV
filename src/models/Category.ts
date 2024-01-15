import mongoose, { Schema } from "mongoose";
import { ICategory } from "../interfaces/ICategory";

const categorySchema: Schema = new Schema<ICategory>({
    name: {
        type: String,
        required: true
    },
    sectionId: {
        type: Schema.Types.ObjectId,
        ref: 'Section'
    },
    fee: {
        type: Number,
        required: true
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, {
    timestamps: true
});

const Category = mongoose.model<ICategory, mongoose.Model<ICategory>>("Category", categorySchema);
export default Category;
