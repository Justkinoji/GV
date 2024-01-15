export const sectionTypeDefs = `
type InputField {
    placeholder: String!
    field: String!
}

type Select {
    placeholder: String!
    values: [String!]!
    field: String!
}

type MinMax {
    field: String!
}

type Filter {
    inputFields: [InputField!]
    selects: [Select!]
    minMax: [MinMax!]
}

type Section {
    id: ID!
    name: String!
    description: String!
    imageUrl: String
    logoUrl: String
    createdBy: User!
    filters: Filter
} 

input InputFieldInput {
    placeholder: String!
    field: String!
}

input SelectInput {
    placeholder: String!
    values: [String!]!
    field: String!
}

input MinMaxInput {
    field: String!
}

input FilterInput {
    inputFields: [InputFieldInput!]
    selects: [SelectInput!]
    minMax: [MinMaxInput!]
}

input ChangeSectionInput {
    _id: ID!
    name: String
    description: String
    imageUrl: String
    logoUrl: String
    filters: FilterInput
}

type SectionResponse {
    id: ID!
    name: String!
    description: String!
    imageUrl: String
    logoUrl: String
    filters: Filter
}

type CategoryMin {
    _id: ID
    name: String
    products: [ID]
}

type SectionGetResponse {
    id: ID!
    name: String!
    description: String!
    imageUrl: String
    logoUrl: String
    filters: Filter
    categories: [CategoryMin]
    createdAt: String
}

input CreateSectionInput {
    name: String!
    description: String!
    imageUrl: String
    logoUrl: String
    filters: FilterInput!
}

type Mutation {
    createSection(input: CreateSectionInput!): SectionResponse
    changeSection(input: ChangeSectionInput!): SectionResponse
    deleteSection(_id: ID!): String
}

type Query {
    getAllSections: [SectionGetResponse!]
    getOneSection(id: ID!): SectionGetResponse
    getSectionByName(name: String!): SectionGetResponse
}
`;
