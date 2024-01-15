export const purchaseProductTypeDefs = `
type PurchaseProduct {
    id: ID!
    productId: ProductDetailsForPurchase
    boughtBy: UserDetail!
    soldBy: UserDetail!
    payment: Payment!
    status: PaymentStatus!
    received: Boolean!
    acceptedAt: String
    sellerSentAt: String
    price: Float
    createdAt: String
}

enum PaymentStatus {
    SUCCEEDED
    PENDING
    FAILED
    CANCELED 
}

enum PaymentMethod {
    STRIPE
    PAYPAL
    COINBASE_COMMERCE
}

type UserDetail {
    userName: String
    avatarURL: String
    
    email: String
    id: ID
    lastActivity: Date
}

type Payment {
    method: PaymentMethod!
    paymentCode: String
}

input PaymentInput {
    method: PaymentMethod!
    paymentCode: String
}

type LanguageMap {
    en: String!
    sh: String
    pt: String
    ar: String
    ru: String
    es: String
}

type ProductDetailsForPurchase {
    id: ID
    shortDescription: LanguageMap
}

input PurchaseProductInput {
    id: ID
    productId: ID!
    soldBy: ID!
    payment: PaymentInput!
    status: PaymentStatus!
    received: Boolean!
    acceptedAt: String
    price: Float
}

input TopSellersOrBuyersInput {
    page: Int!
    limit: Int!
}

input sellerSendDetailsInput {
    purchaseProductId: ID
    sellerSentAt: String
}

type Mutation {
    createPurchaseProduct(input: PurchaseProductInput): PurchaseProduct
    changePurchaseProduct(input: PurchaseProductInput): PurchaseProduct
    sellerSendDetails(input: sellerSendDetailsInput): PurchaseProduct
}

type Query {
    getMyBoughtProducts: [PurchaseProduct]
    getMySoldProducts: [PurchaseProduct]
    getOnePurchase(id: ID!): PurchaseProduct
    getAllUsersPurchases: [PurchaseProduct]
    getTopSellers(input: TopSellersOrBuyersInput): [UserDTO]
    getTopBuyers(input: TopSellersOrBuyersInput): [UserDTO]
    getUserPurchases(userId: ID!): [PurchaseProduct]
    getAllPurchases: [PurchaseProduct]
}
`;
