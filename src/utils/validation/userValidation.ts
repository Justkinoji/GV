import * as yup from 'yup';
import { GraphQLError } from 'graphql';
import {UserAuthenticateData, UserCreationData} from "../../inputs/userTypes";
import { ChangeUserInput } from "../../inputs/userMutationsTypes";

const userCreationSchema = yup.object({
    userName: yup.string().min(3).max(100).notRequired(),
    email: yup.string().email().max(100).required(),
    password: yup.string().min(8).max(100).notRequired(),
    passwordHash: yup.string().notRequired(),
    address: yup.object({
        city: yup.string().min(3).notRequired(),
        zipCode: yup.number().notRequired(),
        street: yup.string().min(6).notRequired(),
        phoneNumber: yup.string().matches(/^\d{9,}$/, "Phone number must have at least 9 digits").notRequired(),
    }).notRequired()
}) as yup.ObjectSchema<UserCreationData>;

const updateUserSchema = yup.object({
    userName: yup.string().min(3).max(100).notRequired(),
    email: yup.string().email().max(100).notRequired(),
    avatarURL: yup.string().url("avatarURL must be a valid URL").notRequired(),
    backgroundColor: yup.string().notRequired(),
    backgroundImage: yup.string().url("backgroundImage must be a valid URL").notRequired(),
    confidentLvl: yup.number().notRequired(),
    bonuses: yup.number().notRequired(),
    level: yup.number().notRequired(),
    experience: yup.number().notRequired(),
    role: yup.string().notRequired(),
    achievements: yup.array().of(yup.string()).notRequired(),
    isTwoFactorEnabled: yup.boolean().notRequired(),
    qrCode: yup.string().notRequired(),
    address: yup.object({
        city: yup.string().min(3).notRequired(),
        zipCode: yup.number().notRequired(),
        street: yup.string().min(6).notRequired(),
        phoneNumber: yup.string().matches(/^\d{9,}$/, "Phone number must have at least 9 digits").notRequired(),
    }).notRequired(),
    subscribed: yup.boolean().notRequired()
}) as yup.ObjectSchema<ChangeUserInput>;

const userAuthenticationSchema = yup.object({
    login: yup.string().max(100).required('Login is required'),
    password: yup.string().min(8).max(100).required('Password is required')
}) as yup.ObjectSchema<UserAuthenticateData>;

export const userValidate = async (validateData: UserCreationData): Promise<void> => {
    try {
        await userCreationSchema.validate(validateData);
    } catch (err) {
        throw new GraphQLError((err as yup.ValidationError).message);
    }
};

export const emailValidate = async (validateData: UserCreationData): Promise<void> => {
    try {
        await yup.string().email().max(100).validate(validateData.email);
    } catch (err) {
        throw new GraphQLError((err as yup.ValidationError).message);
    }
}

export const updateUserValidate = async (validateData: ChangeUserInput): Promise<void> => {
    try {
        await updateUserSchema.validate(validateData);
    } catch (err) {
        throw new GraphQLError((err as yup.ValidationError).message);
    }
};

export const authenticateUserValidate = async (validateData: UserAuthenticateData): Promise<void> => {
    try {
        await userAuthenticationSchema.validate(validateData);
    } catch (err) {
        throw new GraphQLError((err as yup.ValidationError).message);
    }
};
