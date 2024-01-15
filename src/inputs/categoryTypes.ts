import { Types } from "mongoose";

export interface IPopulatedCategory {
    _id: Types.ObjectId;
    name: string;
    fee: number;
    section: {
        _id: Types.ObjectId;
        name: string;
    };
}

export interface IPopulatedCategoryWithProducts {
    _id: Types.ObjectId;
    name: string;
    fee: number;
    sectionId: {
        _id: string;
    };
    products: {
        _id: string;
        createdBy: {
            userName: string;
            avatarURL: string;
            level: number;
            confidentLvl: number;
        }
        price: number;
        imageUrl: string;
        stripePriceId: string;
        shortDescription: {
            en: string;
            sh: string;
            pt: string;
            ar: string;
            ru: string;
            es: string;
        },
        platform: string;
        sold: boolean;
        quantity: number;
        createdAt: string;
    };
}
