import { UserRole } from "../constants/UserRole";
import {Document, Types} from "mongoose";

export interface IUser extends Document {
    soldProducts: any;
    userName?: string;
    email: string;
    emailConfirm?: {
        confirmationCode: Number,
        expire: Date,
        confirmed: Date | null,
    };
    passwordHash: string;
    resetPassword?: {
        resetCode: Number;
        expire: Date;
    };
    phoneConfirm?: {
        code: number;
        expire: Date;
        confirmed?: Date;
    };
    avatarURL?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    confidentLvl?: number;
    bonuses?: number;
    level?: number;
    experience?: number;
    role: UserRole;
    achievements?: Types.ObjectId;
    ratingsStats: {
        [key: number]: number;
    };
    isTwoFactorEnabled?: boolean;
    qrCode?: string;
    address?: {
        city?: string;
        zipCode?: number;
        street?: string;
        phoneNumber?: string;
    };
    subscribed: boolean;
    banned: boolean;
    stripeId?: string;
    paypalInfo?: {
        paypalId?: string;
        confirmed?: Date;
    },
    lastActivity: Date;
    createdAt: string
}

export interface IUserTsIgnore extends Document {
    soldProducts: any;
    userName?: string;
    email: string;
    emailConfirm?: {
        confirmationCode: Number,
        expire: Date,
        confirmed: Date | null,
    };
    passwordHash: string;
    resetPassword?: {
        resetCode: Number;
        expire: Date;
    };
    phoneConfirm?: {
        code: number;
        expire: Date;
        confirmed?: Date;
    };
    avatarURL?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    confidentLvl?: number;
    bonuses?: number;
    level?: number;
    experience?: number;
    role: UserRole;
    achievements?: Types.ObjectId;
    ratingsStats: {
        [key: number]: number;
    };
    isTwoFactorEnabled?: boolean;
    qrCode?: string;
    address?: {
        city?: string;
        zipCode?: number;
        street?: string;
        phoneNumber?: string;
    };
    subscribed: boolean;
    banned: boolean;
    stripeId?: string;
    paypalInfo?: {
        paypalId?: string;
        confirmed?: Date;
    },
    lastActivity: Date;
    createdAt: string
}
