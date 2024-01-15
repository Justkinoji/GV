import mongoose from "mongoose";
import { PubSub } from "graphql-subscriptions";
import BaseService from "./BaseService";
import { authService } from "./AuthService";
import Message from "../models/Message";
import userService from "./UserService";
import chatService from "./ChatService";
import ChatService from "./ChatService";
import { UserNotFoundError } from "../errors/userErrors";
import { validateMessageInput } from "../utils/validation/messageValidation";
import { toMessagesLimited, updateSeenBy } from "../utils/_index";
import { IMessage } from "../interfaces/IMessage";
import {
    GetMessagesInput,
    IMessageLimited,
    MessagePayload,
    SendMessageInput
} from "../inputs/messageMutationTypes";
import { MESSAGE_PER_PAGE, SUBSCRIPTION_NAME } from "../constants/other";
import { toSingleMessageLimited } from "../utils/toMessagesLimited";

const pubsub = new PubSub();

class MessageService extends BaseService<IMessage> {
    constructor() {
        super({ model: Message });
    }

    async sendMessage(data: SendMessageInput, token: string): Promise<IMessageLimited> {
        await validateMessageInput(data);
        const {id: currentUserId} = await authService.verifyTokenAndGetData(token);
        const {recipientId, message} = data;
        const existingUser = await userService.findUserById(recipientId);

        if (!existingUser) {
            throw UserNotFoundError(recipientId);
        }

        const chatRoom = await chatService.getChatRoomByUserIDs({
            currentUserId, recipientId,
        });

        if (chatRoom && "_id" in chatRoom) {
            const newMessage = new Message({
                chatRoom: chatRoom._id,
                sender: currentUserId,
                content: message,
                seenBy: [currentUserId]
            });

            await newMessage.save();

            const populatedMessage = await Message.findById(newMessage._id)
                .populate('sender', 'userName email createdAt avatarURL')
                .populate('seenBy', 'userName email createdAt avatarURL')
                .exec() as IMessage;

            if (!populatedMessage) {
                throw new Error("Failed to populate the saved message.");
            }

            await pubsub.publish(`${SUBSCRIPTION_NAME}/USER_${recipientId}`, {
                lastMessage: populatedMessage,
                chatRoomId: chatRoom._id.toString()
            });

            chatRoom.lastMessage = newMessage.id

            await chatRoom.save()

            return toSingleMessageLimited(populatedMessage);
        }



        throw new Error("Chat room not found or not created.");
    }

    async getMessagesByChatId(data: GetMessagesInput, token: string): Promise<IMessageLimited[]> {

        const { chatId, section } = data;
        await this.isLegalChatRoom(chatId, token);

        const skipMessages = (section - 1) * MESSAGE_PER_PAGE;

        let messages = await Message.find({ chatRoom: chatId })
            .sort({ createdAt: -1 })
            .skip(skipMessages)
            .populate('sender', 'userName email createdAt avatarURL')
            .populate('seenBy', 'userName email createdAt avatarURL')
            .exec() as IMessage[];

        const { id: currentUserIdString  } = await authService.verifyTokenAndGetData(token);
        const currentUserId = new mongoose.Types.ObjectId(currentUserIdString);

        await updateSeenBy(messages, currentUserId);

        return toMessagesLimited(messages);
    }

    async lastMessageSubscription(token: string): Promise<AsyncGenerator<MessagePayload, void, undefined>> {
        const { id: currentUserId } = await authService.verifyTokenAndGetData(token);

        const originalIterator = pubsub.asyncIterator<MessagePayload>(`${SUBSCRIPTION_NAME}/USER_${currentUserId}`) as AsyncIterator<MessagePayload> & { [Symbol.asyncIterator](): AsyncIterator<MessagePayload> };

        async function* messageProcessor(): AsyncGenerator<MessagePayload, void, undefined> {
            for await (const payload of originalIterator) {
                if (payload.lastMessage) {
                    const message = await Message.findById(payload.lastMessage._id)
                        .populate('sender', 'userName email createdAt avatarURL')
                        .populate('seenBy', 'userName email createdAt avatarURL')
                        .exec() as IMessage;

                    if (message) {
                        payload.lastMessage = message;
                    }
                }
                yield payload;
            }
        }


        return messageProcessor();
    }


    async markMessageAsSeen(messageId: string, userId: string): Promise<IMessage> {
        const message = await Message.findById(messageId) as IMessage;
        if (!message) {
            throw new Error("Message not found.");
        }

        const userIdObjectId = new mongoose.Types.ObjectId(userId);

        if (message.seenBy.includes(userIdObjectId)) {

            return message;
        }

        message.seenBy.push(userIdObjectId);
        await message.save();

        return message;
    }


    private async isLegalChatRoom(chatId: string, token: string): Promise<boolean> {
        const { id: currentUserId } = await authService.verifyTokenAndGetData(token);
        const currentChat = await ChatService.getChatRoomById(chatId);

        if (!currentChat) {
            throw new Error("Chat room not found.");
        }

        const objectId = new mongoose.Types.ObjectId(currentUserId);

        return currentChat.members.includes(objectId);
    }
}

export default new MessageService();
