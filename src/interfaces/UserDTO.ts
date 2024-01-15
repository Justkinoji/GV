import { UserRole } from "../constants/UserRole";

export interface UserDTO {
    id: string;
    userName?: string;
    email: string;
    emailConfirmDate: Date | null;
    avatarURL?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    confidentLvl?: number;
    bonuses?: number;
    level?: number;
    experience?: number;
    role: UserRole;
    achievements?: string[];
    ratingsStats: {
        entries: Array<{key: number, value: number}>
    };
    isTwoFactorEnabled?: boolean;
    qrCode?: string;
    address?: {
        city?: string;
        zipCode?: number;
        street?: string;
        phoneNumber?: string;
    };
    phoneConfirmDate: Date | null;
    subscribed: boolean;
    stripeId?: string;
    paypalInfo?: {
        paypalId?: string;
        confirmed?: Date;
    },
    lastActivity: Date;
    createdAt: string;
    soldProducts?: number;
}
