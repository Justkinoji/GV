import { authService } from "../../services/AuthService";
import MessageService from "../../services/MessageService";
import { SendMessageInput } from "../../inputs/messageMutationTypes";

const messageMutationResolver = {
    Mutation: {
        async sendMessage(_: any, { input }: { input: SendMessageInput }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await MessageService.sendMessage(input, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to update user.');
            }
        },

        async seenMessage  (_: any, { messageId }: { messageId: string }, context: any) {
            const { currentUser } = context;
            const userId = currentUser.id;

            try {
                const updatedMessage = await MessageService.markMessageAsSeen(messageId, userId);

                return {
                    success: true,
                    message: "Message marked as seen.",
                    data: updatedMessage
                };
            } catch (error) {
                if (error instanceof Error) {
                    return {
                        success: false,
                        message: error.message
                    };
                }

                return {
                    success: false,
                    message: "An unexpected error occurred."
                };
            }
        }
    }
}

export default messageMutationResolver;