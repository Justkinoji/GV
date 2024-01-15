import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/IUser";
import { UserRole } from "../constants/UserRole";
import { Rating } from "../constants/Rating";

const ratingsStatsSchema = Object.fromEntries(
    Object.values(Rating).filter(value => typeof value === 'number').map(value => [value, { type: Number, default: 0 }])
);

const userSchema: Schema = new Schema<IUser>({
    userName: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    emailConfirm: {
        confirmationCode: Number,
        expire: Date,
        confirmed: Date,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    resetPassword: {
        resetCode: Number,
        expire: Date,
    },
    phoneConfirm: {
        code: Number,
        expire: Date,
        confirmed: { type: Date, default: null },
    },
    avatarURL: String,
    backgroundColor: String,
    backgroundImage: String,
    confidentLvl: {
        type: Number,
        default: 0
    },
    bonuses: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 0
    },
    experience: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.BUYER,
    },
    achievements: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Achievement'
        }
    ],
    ratingsStats: ratingsStatsSchema,
    isTwoFactorEnabled: {
        type: Boolean,
        required: true,
        default: false
    },
    qrCode: String,
    address: {
        city: String,
        zipCode: Number,
        street: String,
        phoneNumber: String
    },
    subscribed: {
        type: Boolean,
        default: false,
    },
    banned: {
        type: Boolean,
        default: false,
    },
    stripeId: {
        type: String,
        default: null
    },
    paypalInfo: {
        paypalId: String,
        confirmed: { type: Date, default: null },
    },
    lastActivity: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: 'users',
});

const User = mongoose.model<IUser, mongoose.Model<IUser>>("User", userSchema);
export default User;
