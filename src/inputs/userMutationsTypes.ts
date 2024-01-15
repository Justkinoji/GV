import { UserRole } from "../constants/UserRole";

interface AddressInput {
    city?: string;
    zipCode?: number;
    street?: string;
    phoneNumber?: string;
}

interface RegisterSellerInput {
    email: string;
    password: string;
    userName?: string;
    address?: AddressInput;
}

interface RegisterBuyerInput {
    email: string;
    password: string;
}

interface LoginInput {
    login: string;
    password: string;
}

interface ChangePasswordInput {
    login: string;
    resetCode: number;
    newPassword: string;
}

interface ChangeUserInput {
    userName?: string;
    avatarURL?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    confidentLvl?: number;
    bonuses?: number;
    level?: number;
    experience?: number;
    role?: UserRole;
    achievements?: string[];
    isTwoFactorEnabled?: Boolean;
    qrCode?: string;
    address?: {
        city?: string;
        zipCode?: number;
        street?: string;
        phoneNumber?: string;
    };
    subscribed?: Boolean;
}

interface ConfirmPhoneInput {
    phoneNumber: string;
    code: number;
}

interface BanUnBanInput{
    userId: string;
    text: string
}

export { AddressInput, RegisterSellerInput, RegisterBuyerInput,
    ChangePasswordInput, ChangeUserInput, ConfirmPhoneInput, LoginInput, BanUnBanInput };
