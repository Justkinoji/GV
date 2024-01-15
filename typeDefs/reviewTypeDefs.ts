export const reviewTypeDefs = `
    type Review {
        id: ID!
        createdBy: UserDetail!
        receivedBy: UserDetail!
        text: String
        rating: Int!
        createdAt: String
        updatedAt: String
    }
    
    input ReviewData {
        receivedBy: ID!
        text: String
        rating: Int!
    }
    
    type UserDetailForReview {
        id: ID!
        userName: String
        avatarURL: String
    }
    
    type GetUserReviewsResponse {
        id: ID!
        createdBy: UserDetailForReview!
        receivedBy: UserDetailForReview!
        text: String
        rating: Int!
        createdAt: String
        updatedAt: String
    }
    
    type Mutation {
        createReview(input: ReviewData): Review
    }
    
    type Query {
        getAllReviews: [Review]
        getMyReviews : [Review]
        getSentReviews : [Review]
        getUserReviews(id: ID!): [GetUserReviewsResponse]
    }
`;
