export const categoryTypeDefs = `
type Category {
    id: ID!
    name: String!
    sectionId: ID!
    fee: Float!
} 

input CategoryInput {
    categoryName: String!
    sectionName: String!
    fee: Float!
}

input CategoryUpdateInput {
    _id: ID!
    name: String
    fee: Float
}

type CategoryResponse {
    id: ID!
    name: String!
    fee: Float
}

type sectionForResponse {
    _id: ID!
    name: String!
}

type CategoryResponseWithSections {
    _id: ID!
    name: String!
    fee: Float
    section: sectionForResponse!
    createdAt: Date
    products: [ID]
}

type SectionIn {
    _id: ID!
    name: String!
    description: String
    imageUrl: String
    logoUrl: String
    filters: Filter
}

type CategoryPopulated {
    _id: ID!
    name: String!
    sectionId: SectionIn
}

type UserDetailForCategory {
    userName: String
    avatarURL: String
    level: Int
    confidentLvl: Int
    experience: Int

    _id: ID!
    lastActivity: Date
}

type ProductForCategory {
    _id: ID!
    createdBy: UserDetailForCategory!
    price: Float!
    imageUrl: String
    stripePriceId: String
    shortDescription: LanguageMap!
    platform: Platform!
    sold: Boolean
    quantity: Int
    createdAt: String!
}

type CategoryPopulatedWithProducts {
    _id: ID!
    name: String!
    fee: Float
    sectionId: ID!
    products: [ProductForCategory!]
}

input FilterGetOneCategory {
    inputFields: [InputFieldInput],
    selects: [SelectInput],
    minMax: [MinMaxRangeInput]    
}

input InputFieldInput {
    placeholder: String
    field: String
    chosen: String
}

input SelectInput {
    placeholder: String
    values: [String]
    field: String
    chosen: String
}

input MinMaxRangeInput {
    field: String
    chosen: MinMaxInput
}

input MinMaxInput {
    min: Int
    max: Int
}

input SignupDateFilter {
    from: String
    to: String
}

input GetAllWithFilters {
    name: String
    signupDate: SignupDateFilter
}

input GetOneCategoryInput {
    id: ID!
    productsPerPage: Int
    page: Int
    filter: FilterGetOneCategory
}

type Mutation {
    createCategory(input: CategoryInput!): CategoryResponse
    changeCategory(input: CategoryUpdateInput!): CategoryResponse
    deleteCategory(_id: ID!): String
}

type Query {
    getAllCategories: [CategoryResponseWithSections!]
    getCategoriesSection(sectionName: String!): [CategoryResponse!]
    getOneCategory(input: GetOneCategoryInput): CategoryPopulatedWithProducts
    getAllCategoriesAdmin(input: GetAllWithFilters!): [CategoryResponseWithSections!]
}
`;
