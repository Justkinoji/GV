import MessageService from "../../services/MessageService";
import { GetMessagesInput, IMessageLimited } from "../../inputs/messageMutationTypes";
import { IChatRoom } from "../../interfaces/IChatRoom";
import ChatService from "../../services/ChatService";

const messageQueryResolver = {
    Query: {
        getMessages: async (_: any, { input }: { input: GetMessagesInput }, context: any):
            Promise<{ chat: IChatRoom | null, messages: IMessageLimited[] }> => {
            try {
                const messages = await MessageService.getMessagesByChatId(input, context.token);
                const chat = await ChatService.getChatRoomById(input.chatId);
                console.log(chat)
                return { chat, messages };
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }
    }
}

export default messageQueryResolver;
