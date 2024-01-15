import mongoose from "mongoose";
import BaseService from "./BaseService";
import { IChatRoom } from "../interfaces/IChatRoom";
import { ChatRoomData } from "../inputs/messageMutationTypes";
import ChatRoom from "../models/ChatRoom";
import { authService } from "./AuthService";

class ChatService extends BaseService<IChatRoom> {
    constructor() {
        super({ model: ChatRoom });
    }

    async getChatRoomByUserIDs(data: ChatRoomData): Promise<IChatRoom | null> {
        const { currentUserId, recipientId } = data;

        const chatRoomExisting = await ChatRoom.findOne({
            members: {
                $all: [currentUserId, recipientId]
            }
        }).exec();

        if(chatRoomExisting) {

            return chatRoomExisting;
        } else {

            return this.createChatRoom(data);
        }
    }

    private async createChatRoom(data: ChatRoomData): Promise<IChatRoom> {
        const { currentUserId, recipientId } = data;

        const chatRoom = new ChatRoom({
            members: [currentUserId, recipientId],
        });

        return chatRoom.save();
    }

    async getChatRoomsByToken(token: string): Promise<IChatRoom[]> {
        const { id: currentUserId } = await authService.verifyTokenAndGetData(token);

        const chats = await ChatRoom.find({ members: currentUserId })
            .populate('lastMessage')
            .populate('members')
            .exec();

        return chats || [];
    }

    async getChatRoomById(chatId: string): Promise<IChatRoom | null> {
        const objectId = new mongoose.Types.ObjectId(chatId);

        return ChatRoom.findById(objectId).populate('lastMessage')
        .populate('members')
        .exec();;
    }
}

    export default new ChatService();
