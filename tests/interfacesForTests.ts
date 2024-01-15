import {UserDTO} from "../interfaces/UserDTO";

interface UserInput {
    email: string;
    password: string;
    userName: string;
    address: {
        city: string;
        zipCode: number;
        street: string;
        phoneNumber: string;
    };
}

interface LoginInput {
    email: string;
    password: string;
}

interface SendMessageTestReturn{
    message: {
        id: string;
        sender: {
            userName: string;
            email: string;
            createdAt: string;
            avatarURL: string;
        };
        content: string;
        seenBy: {
            userName: string;
            email: string;
            createdAt: string;
            avatarURL: string;
        }[];
        createdAt: string;
        updatedAt: string;
    };
    receiverUser: {
        message: string;
        user: UserDTO;
        token: string;
    };
}

export { UserInput, LoginInput, SendMessageTestReturn };