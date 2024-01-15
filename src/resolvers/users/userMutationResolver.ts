import UserService from '../../services/UserService';
import { authService } from "../../services/AuthService";
import { UserRole } from "../../constants/UserRole";
import {
    BanUnBanInput,
    ChangePasswordInput,
    ChangeUserInput,
    ConfirmPhoneInput, LoginInput,
    RegisterBuyerInput,
    RegisterSellerInput
} from '../../inputs/userMutationsTypes';
import { permissionCheck } from '../../utils/permissionCheck';

const userMutationResolvers = {
    Mutation: {
        async registerSeller(_: any, { input }: { input: RegisterSellerInput }) {
            try {
                const { user, token } = await UserService.createObject({
                    ...input,
                    role: UserRole.SELLER
                });

                return {
                    user,
                    token,
                    message: `User ${ user.userName } successfully created`,
                };
            } catch (error) {
                console.error('Error:', error);
                if (error instanceof Error) {
                    throw new Error(error.message);
                } else {
                    throw new Error('An unexpected error occurred');
                }
            }
        },

        async registerBuyer(_: any, { input }: { input: RegisterBuyerInput }) {
            try {
                const { user, token } = await UserService.createObject(input);

                return {
                    user,
                    token,
                    message: `User ${user.email} successfully created`,
                };
            } catch (error) {
                console.error('Error:', error);
                if (error instanceof Error) {
                    throw new Error(error.message);
                } else {
                    throw new Error('An unexpected error occurred');
                }
            }
        },

        async changeUser(_: any, { input }: { input: ChangeUserInput }, context: any) {
            const token = authService.checkToken(context.token);

            try {
                const updatedUser = await UserService.updateUser(input, token);

                return {
                    user: updatedUser,
                    message: `User ${ updatedUser.userName } successfully updated`,
                };
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to update user.');
            }
        },

        async loginUser(_: any, { input }: { input: LoginInput }) {
            try {
                const { user, userId, token } = await UserService.authenticate(input);

                if(user && !userId ) {
                    return {
                        user,
                        token,
                        message: `User ${user.email} successfully authenticated`,
                    }
                }

                return {
                    userId,
                    token,
                    message: `User with id ${userId} successfully authenticated`,
                };
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to authenticate user.');
            }
        },

        async sendPasswordResetCode(_: any, { login }: { login: string }, ___: any) {

            try {

                return await UserService.sendPasswordResetCode(login);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to send password reset code.');
            }
        },

        async sendEmailConfirmCode(_: any, { email }: { email: string }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return  await UserService.sendEmailConfirmCode(email, token) ;
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to send email confirm code.');
            }
        },

        async confirmEmail(_: any, { code }: { code: number }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return  await UserService.confirmEmail(code, token) ;
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to confirm email.');
            }
        },

        async sendEmailConfirmLink(_: any, { email }: { email: string }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await UserService.sendEmailConfirmLink(email, token) ;
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to send email confirm link.');
            }
        },

        async changePassword(_: any, { input }: { input: ChangePasswordInput }, ___: any) {

            try {

                return  await UserService.changePassword(input);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to change password.');
            }
        },

        async addModerator(_: any, { email }: { email: string }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return  await UserService.changeRoleToModerator(email, token) ;
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to change password.');
            }
        },

        async sendPhoneConfirm(_: any, { phoneNumber }: { phoneNumber: string }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await UserService.sendPhoneConfirm(phoneNumber, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Error sending verification code.');
            }
        },

        async confirmPhone(_: any, { input }: { input: ConfirmPhoneInput }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await UserService.confirmPhone(input, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Error sending verification code.');
            }
        },

        async newPassword(_: any, { oldPassword, newPassword }:
            { oldPassword: string, newPassword: string }, context: any) {

            const token = authService.checkToken(context.token);

            try {

                const result = await UserService.newPasswordFromDashboard(oldPassword, newPassword, token);

                return {
                    message: 'Password successfully updated',
                    password: result
                }
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Error sending verification code.');
            }
        },

        async banUser(_: any, { input }: { input: BanUnBanInput }, context: any) {
            await permissionCheck(context.token, UserRole.ADMIN);

            try {

                return await UserService.banUnbanUser(input, true);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Error sending verification code.');
            }
        },

        async unBanUser(_: any, { input }: { input: BanUnBanInput }, context: any) {
            await permissionCheck(context.token, UserRole.ADMIN);

            try {

                return await UserService.banUnbanUser(input, false);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Error sending verification code.');
            }
        },
    }
}

export default userMutationResolvers;
