import { clearDatabase, closeDatabase, connect } from '../../config/jest.mongo.setup';
import messageMutationResolver from '../resolvers/messages/messageMutationResolver';
import userMutationResolvers from "../resolvers/users/userMutationResolver";
import MessageService from "../services/MessageService";
import { SendMessageInput } from "../inputs/messageMutationTypes";
import { LoginInput, SendMessageTestReturn, UserInput } from "./interfacesForTests";

let validUserSenderInput: UserInput;
let validLoginInput: LoginInput;
let validateUserUserReceiverInput: LoginInput;
let testMessage: string;

beforeAll(async () => await connect());

beforeEach(() => {
    validLoginInput = {
        email: 'testemail@gmail.com',
        password: 'TestPassword123'
    }
    validUserSenderInput = {
        ...validLoginInput,
        userName: 'TestUser',
        address: {
            city: 'Kyiv',
            zipCode: 12345,
            street: 'Test Street 123',
            phoneNumber: '0123456789'
        }
    };
    validateUserUserReceiverInput = {
        email: 'testemailSecond@gmail.com',
        password: 'TestPassword123'
    };
    testMessage = "Test message";
});

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe('Message Mutation Resolvers', () => {

    describe('sendMessage', () => {
        it('should send a message successfully', async () => {
            const { message } = await sendMessageTest();

            expect(message.content).toBe(testMessage);
            expect(message.seenBy.length).toBe(1);
            expect(message.seenBy[0].userName).toBe(message.sender.userName);
        });
    });

    describe('seenMessage', () => {
        it('should mark a message as seen successfully', async () => {
            const { receiverUser } = await sendMessageTest();

            const messages = (await MessageService
                .getAll())
                .filter(message => message.content === testMessage);
            const lastMessage = messages[messages.length - 1];

            const context = {
                currentUser: receiverUser.user
            };

            const result = await messageMutationResolver.Mutation.seenMessage(
                null,
                { messageId: lastMessage.id },
                context
            );

            const { success, message, data } = result;

            expect(success).toBeTruthy();
            expect(message).toBe('Message marked as seen.');
            expect(data).toBeDefined();
        });
    });
});

export const sendMessageTest = async (): Promise<SendMessageTestReturn> => {
    const registeredSenderUser = await userMutationResolvers.Mutation.registerSeller(null, {input: validUserSenderInput});
    const receiverUser = await userMutationResolvers.Mutation.registerBuyer(null, {input: validateUserUserReceiverInput});

    const sendMessageInput: SendMessageInput = {
        recipientId: receiverUser.user.id,
        message: testMessage
    }

    const message = await messageMutationResolver.Mutation.sendMessage(
        null,
        { input: sendMessageInput },
        { token: registeredSenderUser.token }
    );

    return { message, receiverUser};
}
