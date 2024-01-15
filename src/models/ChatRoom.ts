import mongoose, { Schema } from "mongoose";
import { IChatRoom } from "../interfaces/IChatRoom";

const chatRoomSchema: Schema = new Schema<IChatRoom>({
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: 'chatrooms',
});

const ChatRoom = mongoose.model<IChatRoom, mongoose.Model<IChatRoom>>("ChatRoom", chatRoomSchema);
export default ChatRoom;
