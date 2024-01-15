import mongoose, { Schema } from 'mongoose';
import { PaymentMethod } from "../constants/paymentMethods";
import { PaymentStatus } from "../constants/paymentStatus";
import { IPurchaseProduct } from "../interfaces/IPurchaseProduct";

const purchaseProductSchema = new Schema<IPurchaseProduct>({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    boughtBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    soldBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    payment: {
        method: {
            type: String,
            enum: Object.values(PaymentMethod),
            required: true,
        },
        paymentCode: {
            type: String,
        },
    },
    status: {
        type: String,
        enum: Object.values(PaymentStatus),
        required: true,
    },
    received: {
        type: Boolean,
        required: true,
    },
    acceptedAt: {
        type: Date,
    },
    sellerSentAt: {
        type: Date,
    },
    price: {
        type: Number,
        required: true,
    },
},
    {
        timestamps: true,
        versionKey: false,
        collection: 'purchaseProducts',
    });

const PurchaseProduct = mongoose.model<IPurchaseProduct, mongoose.Model<IPurchaseProduct>>('PurchaseProduct', purchaseProductSchema);
export default PurchaseProduct;
