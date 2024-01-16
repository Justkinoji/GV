import { clearDatabase, closeDatabase, connect } from '../../config/jest.mongo.setup';
import achievementMutationResolver from '../resolvers/achievements/achievementMutationResolver';
import UserService from '../services/UserService';
import AchievementService from "../services/AchievementService";
import { UserRole } from "../constants/UserRole";

let moderatorUser;
let context: ContextType;

type ContextType = {
    token: string;
}

beforeAll(async () => await connect());

beforeEach(async () => {
    const newUser = {
        email: 'moderator@gmail.com',
        password: 'ModeratorPassword123',
        role: UserRole.MODERATOR
    };
    moderatorUser = await UserService.createObject(newUser);
    context = { token: moderatorUser.token };
});

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe('Achievements Mutation Resolvers', () => {
    it('should create a new achievement', async () => {
        const achievement = await createTestAchievement(context);

        expect(achievement.name).toBe('Test Achievement');
        expect(achievement.description).toBe('This is a test achievement');

        const fetchedAchievement = await AchievementService.getByID(achievement._id);
        expect(fetchedAchievement).not.toBeNull();
    });

    it('should update the achievement', async () => {
        const achievement = await createTestAchievement(context);

        const updatedAchievement = {
            name: 'Updated Achievement',
            image: 'https://updatedimage.com',
            description: 'This is an updated test achievement',
            criteria: [
                {
                    field: 'field2',
                    count: 2
                }
            ],
            bonusPoints: 20
        };

        const args = { _id: achievement._id, input: updatedAchievement };
        const result = await achievementMutationResolver.Mutation.changeAchievement(null, args, context);

        expect(result?.name).toBe(updatedAchievement.name);
        expect(result?.description).toBe(updatedAchievement.description);

        const fetchedUpdatedAchievement = await AchievementService.getByID(result?._id);
        expect(fetchedUpdatedAchievement?.name).toBe(updatedAchievement.name);
    });

    it('should delete the achievement', async () => {
        const achievement = await createTestAchievement(context);

        const args = { _id: achievement._id };
        await achievementMutationResolver.Mutation.deleteAchievement(null, args, context);

        const deletedAchievement = await AchievementService.getByID(achievement._id);
        expect(deletedAchievement).toBeNull();
    });
});

async function createTestAchievement(context: ContextType) {
    const inputAchievement = {
        name: 'Test Achievement',
        image: 'https://testimage.com',
        description: 'This is a test achievement',
        criteria: [
            {
                field: 'field1',
                count: 1
            }
        ],
        bonusPoints: 10
    };

    const args = { input: inputAchievement };

    return await achievementMutationResolver.Mutation.createAchievement(null, args, context);
}

