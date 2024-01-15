import { Document } from 'mongoose';

export interface ISessionSecret extends Document {
    userId: string;
    ascii?: string;
    hex?: string;
    base32: string;
    otpauth_url?: string;
    isActive?: boolean;
    disabled?: boolean;
}
