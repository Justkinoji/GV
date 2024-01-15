import { IMessage } from "../interfaces/IMessage";

interface SendMessageInput {
    recipientId: string;
    message: string;
}

interface ChatRoomData {
    currentUserId: string;
    recipientId: string;
}

interface GetMessagesInput {
    chatId: string;
    section: number;
}

interface IMessageLimited {
    id: string;
    sender: {
        userName: string;
        email: string;
        createdAt: string;
        avatarURL: string;
    };
    content: string;
    seenBy: {
        userName: string;
        email: string;
        createdAt: string;
        avatarURL: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

interface IPopulatedUser {
    userName: string;
    email: string;
    createdAt: Date;
    avatarURL: string;
}

interface MessagePayload {
    lastMessage: IMessage;
    chatRoomId: string;
}

export { ChatRoomData, SendMessageInput, GetMessagesInput, IMessageLimited, IPopulatedUser, MessagePayload };