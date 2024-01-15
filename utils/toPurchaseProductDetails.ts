import { PurchaseProductDetails } from "../inputs/purchaseProductTypes";

export function toPurchaseProductDetails (purchaseProduct: any): PurchaseProductDetails {
    return {
        id: purchaseProduct._id.toString(),
        productId: {
            id: purchaseProduct.productId._id.toString(),
            shortDescription: purchaseProduct.productId.shortDescription,
        },
        boughtBy: {
            id: purchaseProduct.boughtBy._id.toString(),
            userName: purchaseProduct.boughtBy.userName,
            avatarURL: purchaseProduct.boughtBy.avatarURL,

            email: purchaseProduct.boughtBy.email,
            lastActivity: purchaseProduct.boughtBy.lastActivity,
        },
        soldBy: {
            id: purchaseProduct.soldBy._id.toString(),
            userName: purchaseProduct.soldBy.userName,
            avatarURL: purchaseProduct.soldBy.avatarUR,

            email: purchaseProduct.soldBy.email,
            lastActivity: purchaseProduct.soldBy.lastActivity,
        },
        payment: purchaseProduct.payment,
        status: purchaseProduct.status,
        received: purchaseProduct.received,
        acceptedAt: purchaseProduct.acceptedAt,
        sellerSentAt: purchaseProduct.sellerSentAt,
        price: purchaseProduct.price,
        createdAt: purchaseProduct.createdAt
    };
}
