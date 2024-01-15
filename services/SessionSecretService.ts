import mongoose from "mongoose";
import BaseService from './BaseService';
import SessionSecret from '../models/SessionSecret';
import speakeasy from 'speakeasy';
import { authService } from "./AuthService";
import { ISessionSecret } from "../interfaces/ISessionSecret";
import { StringAndTokenInput } from "../inputs/sessionMutationTypes";


class SessionSecretService extends BaseService<ISessionSecret> {
    constructor() {
        super({ model: SessionSecret });
    }

    async generateSessionSecret(token: string): Promise<ISessionSecret> {
        const data = authService.getDataFromToken(token);

        if (!data) {
            throw new Error('Invalid token.');
        }

        const { id } = data;

        const oldSessionSecret = await this.findByUserId(id);

        if (oldSessionSecret) {
            await this.model.findByIdAndDelete(oldSessionSecret._id).exec();
        }

        const secret = speakeasy.generateSecret();
        const sessionSecretData = {
            userId: id,
            ascii: secret.ascii,
            hex: secret.hex,
            base32: secret.base32,
            otpauth_url: secret.otpauth_url,
            isActive: true,
        };

        return this.createObject(sessionSecretData);
    }

    async verifyToken(data: StringAndTokenInput) {
        const { userId, token } = data;

        const sessionSecret = await this.findByUserId(userId);

        if (!sessionSecret) {
            throw new Error('No active QR code found for this user.');
        }

        if (!sessionSecret.base32) {
            throw new Error('Base32 secret not found for the user.');
        }

        return speakeasy.totp.verify({
            secret: sessionSecret.base32,
            encoding: 'base32',
            token: token,
        });
    }

    async findByUserId(userId: string): Promise<ISessionSecret | null> {

        return this.findByField({ userId, isActive: true });
    }

    private async findByField(field: mongoose.FilterQuery<ISessionSecret>): Promise<ISessionSecret | null> {

        return this.model.findOne(field).exec();
    }
}

export const sessionSecretService = new SessionSecretService();
