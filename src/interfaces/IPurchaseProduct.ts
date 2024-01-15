import mongoose, { Document } from "mongoose";

interface IPayment {
    method: string;
    paymentCode?: string;
}

export interface IPurchaseProduct extends Document {
    productId: mongoose.Types.ObjectId;
    boughtBy: mongoose.Types.ObjectId;
    soldBy: mongoose.Types.ObjectId;
    payment: IPayment;
    status: string;
    received: boolean;
    acceptedAt: Date;
    sellerSentAt: Date;
    price: number;
    createdAt: Date;
}
