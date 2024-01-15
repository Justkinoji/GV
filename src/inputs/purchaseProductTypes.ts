import { IUser } from "../interfaces/IUser";

interface PurchaseProductInput {
    id?: string;
    productId: string;
    soldBy: string;
    payment: {
        method: string;
        paymentCode?: string;
    };
    status: string;
    received: boolean;
    acceptedAt: Date;
    price: number;
}

interface SellerSendDetailsInput {
    purchaseProductId: string;
    sellerSentAt: Date;
}

interface PurchaseProductDetails {
    id: string;
    productId: {
        id: string;
        shortDescription: {
            en: string;
            sh: string;
            pt: string;
            ar: string;
            ru: string;
            es: string;
        };
    }
    boughtBy: {
        id: string;
        userName: string;
        avatarURL: string;

        email?: string;
        lastActivity?: Date
    }
    soldBy: {
        id: string;
        userName: string;
        avatarURL: string;

        email?: string;
        lastActivity?: Date
    }
    payment: {
        method: string;
        paymentCode?: string;
    };
    status: string;
    received: boolean;
    acceptedAt: Date;
    sellerSentAt: Date;
    price: number;
    createdAt: Date;
}

interface getTopSellersOrBuyersInput {
    page: number;
    limit: number;
}

type AggregatedResult = {
    count: number;
    user: IUser;
};

export {
    PurchaseProductInput,
    SellerSendDetailsInput,
    PurchaseProductDetails,
    AggregatedResult,
    getTopSellersOrBuyersInput
};
