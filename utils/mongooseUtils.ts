import mongoose from "mongoose";

const toObjectId = (id: string): mongoose.Types.ObjectId => {
    return new mongoose.Types.ObjectId(id);
}

export { toObjectId };