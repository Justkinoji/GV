import { authService } from "../services/AuthService";
import UserService from "../services/UserService";
import { IUser } from "../interfaces/IUser";
import { UserRole } from "../constants/UserRole";

export async function permissionCheck(token: string, role: UserRole): Promise<IUser> {
    const { id } = await authService.verifyTokenAndGetData(token);
    const user = await UserService.findUserById(id);

    if (!user) {
        throw new Error('User not found');
    }

    if (user.role !== role) {
        throw new Error('You do not have permission to perform this action');
    }

    return user;
}
