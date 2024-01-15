import { authService } from "../../services/AuthService";
import { CategoryInput, CategoryUpdateInput } from "../../inputs/sectionAndCategoryTypes";
import CategoryService from "../../services/CategoryService";

const categoryMutationResolver = {
    Mutation: {
        async createCategory(_: any, { input }: { input: CategoryInput }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await CategoryService.createCategory(input, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to update user.');
            }
        },

        async changeCategory(_: any, { input }: { input: CategoryUpdateInput }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await CategoryService.changeCategory(input, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to update user.');
            }
        },

        async deleteCategory(_: any, { _id }: { _id: string }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await CategoryService.deleteCategory(_id, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to update user.');
            }
        }
    }
}

export default categoryMutationResolver