export const achievementTypeDefs = `
type Achievement {
    id: ID!
    name: String!
    image: String!
    description: String!
    criteria: [Criteria]
    bonusPoints: Int
    createdAt: String!
    updatedAt: String!
}

type Criteria {
    field: String!
    count: Int!
}

input CriteriaInput {
    field: String!
    count: Int!
}

input AchievementInput {
    name: String!
    image: String!
    description: String!
    criteria: [CriteriaInput!]!
    bonusPoints: Int
}

type Mutation {
    createAchievement(input: AchievementInput!): Achievement!
    changeAchievement(_id: ID!, input: AchievementInput!): Achievement!
    deleteAchievement(_id: ID!): String
}

type Query {
    getAllAchievements: [Achievement]
    getUserAchievements(userId: ID!): [Achievement]
    getAllAchievementsByFilter(input: GetAllWithFilters): [Achievement]
}
`;