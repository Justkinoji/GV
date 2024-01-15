import BaseService from "./BaseService";
import Achievement from "../models/Achievement";
import { isAdminOrModerator } from "../utils/_index";
import { validateAchievementInput } from "../utils/validation/achievementValidation";
import { IAchievement } from "../interfaces/IAchievement";
import { AchievementInput } from "../inputs/achievementTypes";
import { GetAllWithFilters } from "../inputs/userTypes";

class AchievementService extends BaseService<IAchievement> {
    constructor() {
        super({model: Achievement});
    }

    async createAchievement(data: AchievementInput, token: string): Promise<IAchievement> {
        await isAdminOrModerator(token);
        await validateAchievementInput(data);

        return await super.createObject(data);
    }

    async changeAchievement(_id: string, data: AchievementInput, token: string): Promise<IAchievement | null> {
        await isAdminOrModerator(token);
        await validateAchievementInput(data);

        return await super.updateByID(_id, data);
    }

    async deleteAchievement(_id: string, token: string): Promise<String | null> {
        await isAdminOrModerator(token);

        await super.deleteByID(_id);

        return `Achievement with _id ${_id} successfully deleted`;
    }

    async getUserAchievements(userId: string): Promise<IAchievement[]> {

        return Achievement.find({userId});
    }

    async getAllByFilter(data: GetAllWithFilters): Promise<IAchievement[]> {
        const { name, signupDate } = data;

        const filter: any = {};

        if (name) {
            filter["name"] = { $regex: new RegExp(name, 'i') };
        }

        if (!(signupDate) || signupDate.from && signupDate.to) {
            filter["createdAt"] = { $gte: signupDate?.from, $lte: signupDate?.to };
        }

        return await this.model.find(filter) as IAchievement[];
    }}

export default new AchievementService