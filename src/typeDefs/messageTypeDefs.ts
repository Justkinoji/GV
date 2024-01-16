export const messageTypeDefs = `
    scalar Date

type Message {
    id: ID!
    chatRoom: ChatRoom!
    sender: User!
    content: String!
    seenBy: [User!]!
    createdAt: String!
    updatedAt: String!
}

type UserLimited {
    userName: String
    email: String
    createdAt: String
    avatarURL: String
}

type MessageLimited {
    id: ID!
    sender: UserLimited !
    content: String!
    seenBy: [UserLimited!]!
    createdAt: Date!
    updatedAt: Date!
}

input SendMessageInput {
    recipientId: ID!
    message: String!
}

type GetMessagesResponse {
    messages: [MessageLimited!]!
    chat: ChatRoom!
}

input GetMessagesInput {
    chatId: ID!
    section: Int!
}

type SeenMessageResponse {
    success: Boolean!
    message: String!
    data: Message
}

type Mutation {
    sendMessage(input: SendMessageInput!): MessageLimited!
    seenMessage(messageId: String!): SeenMessageResponse!
}

type Query {
    getMessages(input: GetMessagesInput!): GetMessagesResponse!
}

type Subscription {
    lastMessage: MessageLimited!
}
`;