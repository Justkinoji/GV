import mongoose from 'mongoose';
import Message from '../models/Message';
import { IMessage } from '../interfaces/IMessage';

export async function updateSeenBy(messages: IMessage[], currentUserId: mongoose.Types.ObjectId): Promise<void> {
    const messageIdsToUpdate = [];

    for (let message of messages) {
        if (!message.seenBy.some(seenId => (seenId as mongoose.Types.ObjectId).equals(currentUserId))) {
            messageIdsToUpdate.push(message._id);
            message.seenBy.push(currentUserId);
        }
    }

    if (messageIdsToUpdate.length) {
        await Message.updateMany(
            { _id: { $in: messageIdsToUpdate } },
            { $push: { seenBy: currentUserId } }
        );
    }
}
