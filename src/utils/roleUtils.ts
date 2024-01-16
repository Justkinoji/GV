import { UserRole } from "../constants/UserRole";
import userService from "../services/UserService";
import { authService } from "../services/AuthService";

export async function isAdminOrModerator(token: string): Promise<boolean> {
    const { id } = await authService.verifyTokenAndGetData(token);
    const currentUser = await userService.findUserById(id);

    return currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.MODERATOR;
}