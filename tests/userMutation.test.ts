import { clearDatabase, closeDatabase, connect } from '../../config/jest.mongo.setup';
import userMutationResolvers from "../resolvers/users/userMutationResolver";
import {authService} from "../services/AuthService";
import UserService from "../services/UserService";
import { LoginInput, UserInput } from "./interfacesForTests";

let validUserInput: UserInput;
let validLoginInput: LoginInput;

beforeAll(async () => await connect());

beforeEach(() => {
    validLoginInput = {
        email: 'testemail@gmail.com',
        password: 'TestPassword123'
    }
    validUserInput = {
        ...validLoginInput,
        userName: 'TestUser',
        address: {
            city: 'Kyiv',
            zipCode: 12345,
            street: 'Test Street 123',
            phoneNumber: '0123456789'
        }
    };
});

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe('User Mutation Resolvers', () => {

    describe('registerSeller', () => {
        it('should register a seller successfully', async () => {
            const response = await userMutationResolvers.Mutation.registerSeller(null, { input: validUserInput });
            const decodedData = authService.getDataFromToken(response.token);

            expect(response.user).toBeDefined();
            expect(decodedData).toBeDefined();
            expect(decodedData!.name).toBe(validUserInput.userName);
            expect(response.message).toBe(`User ${response.user.userName} successfully created`);
        });
    });

    describe('registerBuyer', () => {
        it('should register a buyer successfully', async () => {
            const validBuyerInput = {
                email: validUserInput.email,
                password: validUserInput.password
            }
            const response = await userMutationResolvers.Mutation.registerBuyer(null, { input: validBuyerInput });
            const decodedData = authService.getDataFromToken(response.token);
            const userFromDB = await UserService.findUserByEmail(validUserInput.email);

            expect(response.user).toBeDefined();
            expect(decodedData).toBeDefined();
            expect(userFromDB?.email).toBe(validBuyerInput.email);
            expect(response.message).toBe(`User ${response.user.email} successfully created`);
        });
    });

    describe('changeUser', () => {
        it('should update a user successfully', async () => {
            const initialUser = await userMutationResolvers.Mutation.registerSeller(null, { input: validUserInput });
            authService.checkToken(initialUser.token);

            const newUserData = {
                ...validUserInput,
                userName: "UpdatedUserName"
            };

            const response = await userMutationResolvers.Mutation.changeUser(null, {
                input: newUserData }, { token: initialUser.token });

            expect(response.user.userName).toBe(newUserData.userName);
            expect(response.message).toBe(`User ${response.user.userName} successfully updated`);
        });
    });

    describe('loginUser', () => {
        it('should login a user successfully', async () => {
            await userMutationResolvers.Mutation.registerSeller(null, { input: { ...validUserInput } });

            const response = await userMutationResolvers.Mutation.loginUser(null, { input: { ...validLoginInput }});

            expect(response.user.email).toBe(validLoginInput.email);
            expect(response.token).toBeDefined();
            expect(response.message).toBe(`User ${response.user.email} successfully authenticated`);
        });

        it('should fail to login with wrong password', async () => {
            await userMutationResolvers.Mutation.registerSeller(null, { input: { ...validUserInput }});

            const wrongCredentials = {
                email: validLoginInput.email,
                password: "wrongPassword"
            };

            await expect(userMutationResolvers.Mutation.loginUser(null, { input: wrongCredentials }))
                .rejects.toThrow('Failed to authenticate user.');
        });
    });

    describe('sendPasswordResetCode', () => {
        it('should send a password reset code successfully', async () => {
            const registeredUser = await userMutationResolvers.Mutation.registerSeller(null, { input: validUserInput });
            const response = await userMutationResolvers.Mutation.sendPasswordResetCode(
                null, {}, { token: registeredUser.token });
            const currentUser = await UserService.findUserByEmail(validUserInput.email);

            expect(currentUser?.resetPassword?.resetCode).toBeDefined();
            expect(response).toBe(`Email to ${validUserInput.email} has been sent successfully.`);
        });
    });

    describe('sendEmailConfirmCode', () => {
        it('should send an email confirm code successfully', async () => {
            const registeredUser = await userMutationResolvers.Mutation.registerSeller(null, { input: validUserInput });
            const response = await userMutationResolvers.Mutation.sendEmailConfirmCode(
                null, { email: validUserInput.email }, { token: registeredUser.token });
            const currentUser = await UserService.findUserByEmail(validUserInput.email);

            expect(currentUser?.emailConfirm?.confirmationCode).toBeDefined();
            expect(response).toBe(`Email to ${validUserInput.email} has been sent successfully.`);
        });
    });

    describe('confirmEmail', () => {
        it('should confirm the email successfully', async () => {
            const registeredUser = await userMutationResolvers.Mutation.registerSeller(null, { input: validUserInput });
            await userMutationResolvers.Mutation.sendEmailConfirmCode(
                null, { email: validUserInput.email }, { token: registeredUser.token });
            const currentUser = await UserService.findUserByEmail(validUserInput.email);

            const response = await userMutationResolvers.Mutation.confirmEmail(
                null, { code: Number( currentUser?.emailConfirm?.confirmationCode || 0 )},
                { token: registeredUser.token });

            expect(response).toBe('Email successfully confirmed.');
        });
    });

    describe('changePassword', () => {
        it('should change the user password successfully', async () => {
            const registeredUser = await userMutationResolvers.Mutation.registerSeller(null, { input: validUserInput });
            await userMutationResolvers.Mutation.sendPasswordResetCode(null, {}, { token: registeredUser.token });
            const currentUser = await UserService.findUserByEmail(validUserInput.email);

            const changePasswordInput = {
                resetCode: Number(currentUser?.resetPassword?.resetCode || 0),
                newPassword: 'NewTestPassword123'
            };
            const response = await userMutationResolvers.Mutation.changePassword(
                null, { input: changePasswordInput }, { token: registeredUser.token });

            expect(response).toBe('Password successfully changed.');
        });
    });

    describe('addModerator', () => {
        it('should add a user as a moderator', async () => {
            const registeredUser = await userMutationResolvers.Mutation.registerSeller(null, { input: validUserInput });
            const response = await userMutationResolvers.Mutation.addModerator(
                null, { email: validUserInput.email }, { token: registeredUser.token });
            const currentUser = await UserService.findUserByEmail(validUserInput.email);

            expect(currentUser?.role).toBe('MODERATOR');
            expect(response).toBe('User successfully added as a moderator.');
        });
    });
});
