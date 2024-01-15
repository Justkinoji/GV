import { authService } from "../../services/AuthService";
import AchievementService from "../../services/AchievementService";
import { GetAllWithFilters } from "../../inputs/userTypes";

const achievementQueryResolver = {
    Query: {
        async getAllAchievements (_: any, __: any, context: any){
            authService.checkToken(context.token);

            try {

                return await AchievementService.getAll();
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to get achievements.');
            }
        },

        async getUserAchievements (_: any, { userId }: { userId: string }, context: any){
            authService.checkToken(context.token);

            try {

                return await AchievementService.getUserAchievements(userId);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to get achievements.');
            }
        },

        async getAllAchievementsByFilter(_: any, { input }: { input: GetAllWithFilters }, context: any){
            authService.checkToken(context.token);

            try {

                return await AchievementService.getAllByFilter(input);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to get achievements.');
            }
        }
    }
}

export default achievementQueryResolver;
