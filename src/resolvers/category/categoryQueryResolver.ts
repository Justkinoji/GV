import CategoryService from "../../services/CategoryService";
import { authService } from "../../services/AuthService";
import { GetAllWithFilters } from "../../inputs/userTypes";
import { GetOneCategoryInput } from "../../inputs/sectionAndCategoryTypes";

const categoryQueryResolver = {
    Query: {
        async getAllCategories(){
            try {

                return await CategoryService.getAllCategories();

            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to get sections.');
            }
        },

        async getCategoriesSection (_: any, { sectionName }: { sectionName: string }){
            try {

                return await CategoryService.getBySection(sectionName);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to get sections.');
            }
        },

        async getOneCategory (_: any, { input }: { input: GetOneCategoryInput }){
            try {

                return await CategoryService.getByIdWithProducts(input);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to get sections.');
            }
        },

        async getAllCategoriesAdmin (_: any, { input }: { input: GetAllWithFilters }, context: any ){
            try {
                const token = authService.checkToken(context.token);

                return await CategoryService.getAllCategoriesAdmin(input, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to get sections.');
            }
        }
    }
}

export default categoryQueryResolver;
