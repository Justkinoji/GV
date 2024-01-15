import { IMessage } from '../interfaces/IMessage';
import { IMessageLimited } from "../inputs/messageMutationTypes";
import { isPopulatedUser } from "./isPopulatedUser";

function transformMessage(message: IMessage): IMessageLimited {
    if (isPopulatedUser(message.sender)) {
        return {
            id: message._id.toString(),
            sender: {
                userName: message.sender.userName,
                email: message.sender.email,
                createdAt: message.sender.createdAt.toString(),
                avatarURL: message.sender.avatarURL
            },
            content: message.content,
            seenBy: message.seenBy.map(user => isPopulatedUser(user) ? {
                userName: user.userName,
                email: user.email,
                createdAt: user.createdAt.toString(),
                avatarURL: user.avatarURL
            } : {
                userName: "",
                email: "",
                createdAt: "",
                avatarURL: "",
            }),
            createdAt: message.createdAt.toString(),
            updatedAt: message.updatedAt.toString()
        };
    }
    throw new Error("Sender is not populated.");
}

export function toSingleMessageLimited(message: IMessage): IMessageLimited {
    return transformMessage(message);
}

export function toMessagesLimited(messages: IMessage[]): IMessageLimited[] {
    return messages.map(transformMessage);
}
