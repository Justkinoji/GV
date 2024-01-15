import ChatService from "../../services/ChatService";
import { IChatRoom } from "../../interfaces/IChatRoom";

const chatQueryResolver = {
    Query: {
        async getChats(_: any, __: any, context: any): Promise<{ chats: IChatRoom[] }> {
            try {
                const chatRooms = await ChatService.getChatRoomsByToken(context.token);

                return { chats: chatRooms };
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to get chats.');
            }
        },
    }
}

export default chatQueryResolver;
