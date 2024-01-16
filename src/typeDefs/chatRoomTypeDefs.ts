export const chatRoomTypeDefs = `
    scalar Date

type ChatRoom {
    id: ID!
    members: [UserLimited!]!
    lastMessage: MessageLimited
    createdAt: Date!
    updatedAt: Date!
}

input ChatRoomInput {
    memberIds: [ID!]!
}

type GetChatsResponse {
    chats: [ChatRoom!]!
}

type Query {
    getChats: GetChatsResponse!
}
`;
