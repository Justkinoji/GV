import { ProductDetails } from "../inputs/productInterfaces";
import { Platform } from "../constants/Platform";

export function toProductDetails(product: any): ProductDetails {
    const {
        _id,
        createdBy,
        price,
        imageUrl,
        categoryId,
        sectionId,
        shortDescription,
        description,
        platform,
        server,
        sold,
        quantity,
        createdAt
    } = product;

    return {
        id: _id.toString(),
        createdBy: {
            id: createdBy._id.toString(),
            userName: createdBy.userName,
            email: createdBy.email,
            avatarURL: createdBy.avatarURL || '',
            payPalInfo: {
                paypalId: createdBy.payPalInfo?.paypalId || '',
                confirmed: createdBy.payPalInfo?.confirmed?.toString() || ''
            },
            stripeId: createdBy.stripeId || '',
            ratingsStats: {
                total: createdBy.ratingsStats.total || 0,
                average: createdBy.ratingsStats.average || 0
            },
            lastActivity: createdBy.lastActivity
        },
        price: Number(price),
        imageUrl,
        categoryName: categoryId.name,
        sectionName: sectionId.name,
        description: {
            en: description.en?.toString() ?? '',
            sh: description.sh?.toString() ?? '',
            pt: description.pt?.toString() ?? '',
            ar: description.ar?.toString() ?? '',
            ru: description.ru?.toString() ?? '',
            es: description.es?.toString() ?? '',
        },
        shortDescription: {
            en: shortDescription.en?.toString() ?? '',
            sh: shortDescription.sh?.toString() ?? '',
            pt: shortDescription.pt?.toString() ?? '',
            ar: shortDescription.ar?.toString() ?? '',
            ru: shortDescription.ru?.toString() ?? '',
            es: shortDescription.es?.toString() ?? '',
        },
        platform: platform as Platform,
        server,
        sold,
        quantity,
        createdAt: createdAt.toString()
    };
}
