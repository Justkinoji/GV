export const productTypeDefs = `
enum Platform {
    PC
    PS
    XBOX
}

enum Language {
    en
    sh
    pt
    ar
    ru
    es
}

type Product {
    id: ID!
    createdBy: User!
    price: Float!
    imageUrl: String
    categoryId: Category!
    sectionId: Section!
    description: LanguageMap!
    shortDescription: LanguageMap!
    platform: Platform!
    server: String
    sold: Boolean
    quantity: Int
    createdAt: String!
    updatedAt: String!
}

input ProductInput {
    id: ID
    price: Float!
    imageUrl: String
    categoryId: ID!
    sectionId: ID!
    description: LanguageInput!
    shortDescription: LanguageInput!
    platform: Platform!
    server: String
    sold: Boolean
    quantity: Int!
}

type LanguageMap {
    en: String!
    sh: String
    pt: String
    ar: String
    ru: String
    es: String
}

type PayPalInfo {
    paypalId: String
    confirmed: String
}

type UserDetail {
    userName: String
    avatarURL: String
    
    email: String
    lastActivity: Date
}

type UserDetailWithStats {
    id: ID!
    userName: String
    email: String!
    avatarURL: String
    payPalInfo: PayPalInfo
    stripeId: String
    ratingsStats: RatingStats
}

type ProductDetails {
    id: ID!
    createdBy: UserDetail!
    price: Float!
    imageUrl: String
    stripePriceId: String
    categoryName: String!
    sectionName: String!
    shortDescription: LanguageMap!
    description: LanguageMap!
    platform: Platform!
    server: String
    sold: Boolean
    quantity: Int
    createdAt: String!
}

type GetOneProductResponse {
    id: ID!
    createdBy: UserDetailWithStats!
    price: Float!
    imageUrl: String
    stripePriceId: String
    categoryName: String!
    sectionName: String!
    description: LanguageMap!
    shortDescription: LanguageMap!
    platform: Platform!
    server: String
    sold: Boolean
    quantity: Int
    createdAt: String!
}

input LanguageInput {
    en: String!
    sh: String
    pt: String
    ar: String
    ru: String
    es: String
}

type ProductResponse {
    id: ID!
    price: Float!
    imageUrl: String
    stripePriceId: String
    category: String!
    section: String!
    description: LanguageMap!
    shortDescription: LanguageMap!
    platform: Platform!
    server: String
    sold: Boolean
    quantity: Int
}

type Mutation {
    createProduct(input: ProductInput!): ProductResponse
    changeProduct(input: ProductInput!): ProductResponse
    deleteProduct(id: ID!): String
}

type Query {
    getAllProducts(section: String!): [ProductDetails!]
    getOneProduct(id: ID!): GetOneProductResponse
    getMyProducts: [ProductDetails!]
    getMyOneProduct(id: ID!): GetOneProductResponse
    getSellerProducts(id: ID!): [ProductDetails!]
}
`;
