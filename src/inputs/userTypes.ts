import { UserRole } from "../constants/UserRole";

interface Address {
    city?: string;
    zipCode?: number;
    street?: string;
    phoneNumber?: string;
}

interface UserCreationData {
    _id?: string;
    email: string;
    password?: string;
    passwordHash?: string;
    userName?: string;
    address?: Address;
    emailConfirm?: EmailConfirm;
    role?: UserRole;
}

interface UserAuthenticateData {
    login: string;
    password: string;
}

interface EmailConfirm {
    confirmationCode: number;
    expire: Date;
    confirmed: Date;
}

interface GetAllWithFilters {
    name?: string;
    signupDate?: { from: Date, to: Date };
}

export { Address, UserCreationData, UserAuthenticateData, GetAllWithFilters };
