import { authService } from "../../services/AuthService";
import SectionService from "../../services/SectionService";
import { ChangeSectionInput, CreateSectionInput } from "../../inputs/sectionAndCategoryTypes";

const sectionMutationResolver = {
    Mutation: {
        async createSection(_: any, { input }: { input: CreateSectionInput }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await SectionService.createSection(input, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong when creating a new section');
            }
        },

        async changeSection(_: any, { input }: { input: ChangeSectionInput }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await SectionService.changeSection(input, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong when changing a section');
            }
        },

        async deleteSection(_: any, { _id }: { _id: string }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await SectionService.deleteSection(_id, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong when deleting a section');
            }
        }
    }
}

export default sectionMutationResolver;