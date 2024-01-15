import { Platform } from "../constants/Platform";

interface Description {
    en: string;
    sh?: string;
    pt?: string;
    ar?: string;
    ru?: string;
    es?: string;
}

interface ProductCreateInput {
    id?: string;
    price: number;
    imageUrl?: string;
    categoryId: string;
    sectionId: string;
    description: Description;
    shortDescription: Description;
    platform: Platform;
    server?: string;
    sold?: boolean;
    quantity: number;
}

interface ProductResponse {
    id: string;
    price: number;
    imageUrl: string;
    category: string;
    section: string;
    description: Description;
    shortDescription: Description;
    platform: Platform;
    sold: boolean;
    quantity: number;
}

interface ProductDetails {
    id: string;
    createdBy: {
        id: string;
        userName: string;
        email: string;
        avatarURL: string;
        payPalInfo?: {
            paypalId?: String
            confirmed?: String
        }
        stripeId?: string
        ratingsStats?: {
            total?: number;
            average?: number;
        }
        lastActivity: string
    };
    price: number;
    imageUrl: string;
    categoryName: string;
    sectionName: string;
    description: Description;
    shortDescription: Description;
    platform: Platform;
    server?: string;
    sold: boolean;
    quantity: number;
    createdAt: string;
}

export { ProductCreateInput, ProductResponse, ProductDetails };
