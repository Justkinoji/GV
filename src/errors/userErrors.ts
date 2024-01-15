import { CustomError } from "../interfaces/ICustomError";

export function UserExistsError(email: string): CustomError {
    const error = new Error(`User with email: ${ email } already exists`) as CustomError;
    error.name = "UserExistsError";
    error.extensions = { code: 'BAD_USER_INPUT' };
    return error;
}

export function UserNotFoundError(idOrEmail: string, isByEmail = false): CustomError {
    let errorMessage = isByEmail
        ? `User with email: ${idOrEmail} does not exist`
        : `User with id: ${idOrEmail} does not exist`;

    const error = new Error(errorMessage) as CustomError;
    error.name = "UserNotFoundError";
    error.extensions = { code: 'BAD_USER_INPUT' };
    return error;
}
