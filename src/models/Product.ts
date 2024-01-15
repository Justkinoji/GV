import mongoose, { Schema } from 'mongoose';
import { IProduct } from "../interfaces/IProduct";
import { Platform } from "../constants/Platform";
import { Language } from "../constants/Language";

const languageSchema = Object.fromEntries(
    Object.values(Language).map(lang => {
        return lang === Language.EN
            ? [lang, { type: String, required: true }]
            : [lang, { type: String }];
    })
);

const productSchema = new Schema<IProduct>(
    {
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        imageUrl: {
            type: String
        },
        stripePriceId: String,
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        sectionId: {
            type: Schema.Types.ObjectId,
            ref: 'Section',
            required: true,
        },
        description: {
            ...languageSchema
        },
        shortDescription: {
            ...languageSchema
        },
        platform: { type: String, enum: Object.values(Platform), required: true },
        server: String,
        sold: {
            type: Boolean,
            default: false
        },
        quantity: {
            type: Number
        }
    },
    {
        timestamps: true,
        versionKey: false,
        collection: 'products',
    },
);

const Product = mongoose.model<IProduct, mongoose.Model<IProduct>>('Product', productSchema);
export default Product;
