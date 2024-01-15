import mongoose, { Schema } from "mongoose";
import { IMessage } from "../interfaces/IMessage";

const messageSchema: Schema = new Schema<IMessage>({
    chatRoom: {
        type: Schema.Types.ObjectId,
        ref: 'ChatRoom',
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    seenBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true,
    versionKey: false,
    collection: 'messages',
});

const Message = mongoose.model<IMessage, mongoose.Model<IMessage>>("Message", messageSchema);
export default Message;
