import mongoose, { Schema } from 'mongoose';
import { ISessionSecret } from '../interfaces/ISessionSecret';

const sessionSecretSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    ascii: { type: String },
    hex: { type: String },
    base32: { type: String, required: true },
    otpauth_url: { type: String },
    isActive: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
});

const SessionSecret = mongoose.model<ISessionSecret, mongoose.Model<ISessionSecret>>("SessionSecret", sessionSecretSchema);
export default SessionSecret;
