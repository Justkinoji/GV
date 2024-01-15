import { sessionSecretService } from '../../services/SessionSecretService';
import qrcode from 'qrcode';
import { StringAndTokenInput } from "../../inputs/sessionMutationTypes";
import {authService} from "../../services/AuthService";
import userService from "../../services/UserService";
import {toUserDTO} from "../../utils/_index";

const sessionSecretMutationResolver = {
    Mutation: {
        async sessionGenerateQrcode(_: any, __: any, context: any)  {
            const token = authService.checkToken(context.token);
            const sessionSecret = await sessionSecretService.generateSessionSecret(token);

            if (!sessionSecret.otpauth_url) {
                throw new Error('No otpauth_url found for the session secret.');
            }

            const qrCodeUrl = await qrcode.toDataURL(sessionSecret.otpauth_url);

            return {
                qrCodeUrl,
                message: 'QR Code generated successfully.',
            };
        },

        async sessionScanQrcode(_: any,{ input }: { input: StringAndTokenInput }) {

            const isVerified = await sessionSecretService.verifyToken(input);
            const user = await userService.findUserById(input.userId);

            if (!user) {
                throw new Error('User not found.');
            }

            if (!isVerified) {
                throw new Error('Invalid token. QR code scan failed.');
            }

            user.isTwoFactorEnabled = true;
            await user.save();

            return {
                message: 'QR Code scanned successfully.',
                user: toUserDTO(user)
            };
        },
    },
};

export default sessionSecretMutationResolver;
