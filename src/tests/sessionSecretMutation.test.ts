import { clearDatabase, closeDatabase, connect } from '../../config/jest.mongo.setup';
import { createTestAdmin } from './testDataHelpers';
import sessionSecretMutationResolver from '../resolvers/sessionSecret/sessionSecretMutationResolvers';
import { sessionSecretService } from '../services/SessionSecretService';
import speakeasy from "speakeasy";
import UserService from "../services/UserService";
import { ContextType } from './typesForTests';

let adminContext: ContextType;

beforeAll(async () => await connect());

beforeEach(async () => {
    adminContext = { token: await createTestAdmin() };
});

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe('Session Secret Mutation Resolvers', () => {
    it('should generate QR code', async () => {
        const response = await sessionSecretMutationResolver.Mutation.sessionGenerateQrcode(null, null, adminContext);
        expect(response.qrCodeUrl).toBeDefined();
        expect(response.message).toBe('QR Code generated successfully.');
    });

    it('should verify session token', async () => {
        const generatedSecret = await sessionSecretService.generateSessionSecret(adminContext.token);

        const validToken = speakeasy.totp({
            secret: generatedSecret.base32,
            encoding: 'base32'
        });

        const adminUser = await UserService.findUserByEmail("admin@gmail.com");

        expect(adminUser).not.toBeNull();

        const args = {
            input: {
                userId: adminUser?.id,
                token: validToken
            }
        };

        const response = await sessionSecretMutationResolver.Mutation.sessionScanQrcode(null, args);
        expect(response.message).toBe('QR Code scanned successfully.');
    });

    it('should fail for invalid session token', async () => {
        const adminUser = await UserService.findUserByEmail("admin@gmail.com");

        expect(adminUser).not.toBeNull();

        const args = {
            input: {
                userId: adminUser?.id,
                token: 'invalid_token'
            }
        };

        await expect(sessionSecretMutationResolver.Mutation.sessionScanQrcode(null, args))
            .rejects.toThrow('No active QR code found for this user.');
    });
});
