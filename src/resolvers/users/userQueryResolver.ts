import UserService from "../../services/UserService";
import { toUserDTO } from "../../utils/toUserDTO";
import { authService } from "../../services/AuthService";
import { UserRole } from "../../constants/UserRole";
import {GetAllWithFilters} from "../../inputs/userTypes";

const queryResolvers = {
    Query: {
        async getUsers(_: any, __: any, context: any) {
            try {
                const token = authService.checkToken(context.token);

                return await UserService.getAllUsers(token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to fetch users.');
            }
        },

        async getUserByToken(_: any, __: any, context: any) {
            try {
                const token = authService.checkToken(context.token);

                return await UserService.getUserByToken(token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to fetch user by token.');
            }
        },

        async getUserById(_: any, { id }: { id: string }) {
            try {
                const user = await UserService.findUserById(id);
                if (!user) {
                    throw new Error('User not found.');
                }

                return toUserDTO(user);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to fetch user by ID.');
            }
        },

        async getUserByRole(_: any, { role }: { role: UserRole }) {
            try {

                return await UserService.getUsersByRole(role);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to fetch users by role.');
            }
        },

        async getAllSellers(_: any, { input }: { input: GetAllWithFilters }) {
            try {

                return await UserService.getUsersByRoleWithFilter(input, UserRole.SELLER);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to fetch sellers based on filters.');
            }
        },

        async getAllBuyers(_: any, { input }: { input: GetAllWithFilters }) {
            try {

                return await UserService.getUsersByRoleWithFilter(input, UserRole.BUYER);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to fetch buyers based on filters.');
            }
        },

        async getSellerForAdmin(_: any, { id }: { id: string }, context: any) {
            try {
                const token = authService.checkToken(context.token);

                return await UserService.getSellerForAdmin(id, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to fetch seller for admin.');
            }
        }
    }
}

export default queryResolvers;
