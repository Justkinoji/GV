import { authService } from "../../services/AuthService";
import AchievementService from "../../services/AchievementService";
import { AchievementInput } from "../../inputs/achievementTypes";

const achievementMutationResolver = {
    Mutation: {
        async createAchievement(_: any, { input }: { input: AchievementInput }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await AchievementService.createAchievement(input, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to create achievement.');
            }
        },

        async changeAchievement(_: any, { _id, input }: { _id: string, input: AchievementInput }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await AchievementService.changeAchievement(_id, input, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to update achievement.');
            }
        },

        async deleteAchievement(_: any, { _id }: { _id: string }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await AchievementService.deleteAchievement(_id, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to delete achievement.');
            }
        }
    }
}

export default achievementMutationResolver