import User from "../models/User";
import BaseService from "./BaseService";
import { IUser } from "../interfaces/IUser";
import { GetAllWithFilters, UserAuthenticateData, UserCreationData } from '../inputs/userTypes';
import {
    comparePasswordHash,
    createPasswordHash,
    emailValidate,
    generateRandomCode,
    isEmail,
    sendPasswordCodeEmail,
    sendPasswordCodeSMS,
    updateUserFields,
    updateUserValidate,
    userValidate,
    permissionCheck,
    sendEmailWithLink,
    toUserDTO,
    userNameGenerator
} from "../utils/_index";
import {  authService} from "./AuthService";
import {
    ChangePasswordInput,
    ChangeUserInput,
    ConfirmPhoneInput,
} from "../inputs/userMutationsTypes";
import { UserDTO } from "../interfaces/UserDTO";
import { UserRole } from "../constants/UserRole";
import { UserExistsError, UserNotFoundError } from "../errors/userErrors";
import { authenticateUserValidate } from "../utils/validation/userValidation";
import { sendBanNotification, sendUnBanNotification } from "../utils/sendToEmail";
import PurchaseProduct from "../models/PurchaseProduct";
import { toUserDTOTsIgnore } from "../utils/toUserDTO";

class UserService extends BaseService<IUser> {
    constructor() {
        super({model: User});
    }

    async createObject(data: UserCreationData) {
        await userValidate(data);
        if(!data.userName) {
            data.userName = await userNameGenerator(data.email);
        }
        const existingUser = await this.findUserByEmail(data.email);
        if (existingUser) {
            throw UserExistsError(data.email);
        }

        if (!data.password) {
            throw Error("Password is required");
        }

        data.passwordHash = await createPasswordHash(data.password);
        delete data.password;

        const user = await super.createObject(data as Partial<IUser>);
        const token = authService.generateToken(user._id, user.userName);

        if (process.env.NODE_ENV !== 'test') {
            await this.sendEmailConfirmLink(user.email, token);
        }

        const dto = toUserDTO(user);

        return { user: dto, token };
    }

    async updateUser(data: ChangeUserInput, token: string): Promise<UserDTO> {
        await updateUserValidate(data);

        const { id } = await authService.verifyTokenAndGetData(token);

        const user = await this.findUserById(id);

        if (!user) {
            throw UserNotFoundError(id);
        }

        if (data.role === UserRole.SELLER) {
            if (!data.userName ||
                !data.address ||
                !data.address.city ||
                !data.address.zipCode ||
                !data.address.street ||
                !user.phoneConfirm ||
                !user.phoneConfirm.confirmed) {
                throw new Error("To change role to SELLER, you must provide userName, city, zipCode, street, and have phone confirmed.");
            }
        }

        updateUserFields(user, data);

        await user.save();

        if(user.emailConfirm?.confirmed === null) {
            await this.sendEmailConfirmCode(user.email, token);
        }

        return toUserDTO(user);
    }

    async authenticate(data: UserAuthenticateData) {
        await authenticateUserValidate(data);

        const user = await this.findUserByLogin(data.login);

        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await comparePasswordHash(data.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const token = authService.generateToken(user._id, user.userName);

        const dto = toUserDTO(user);

        if (dto.isTwoFactorEnabled) {
            return {
              userId: dto.id,
              token
            }
        }

        return {
            user: dto,
            token
        };
    }

    async findUserById(id: string): Promise<IUser | null> {

        return this.findByField({_id: id});
    }

    async findUserByEmail(email: string): Promise<IUser | null> {

        return this.findByField({email});
    }

    async getAllUsers(token: string): Promise<UserDTO[]> {
        await permissionCheck(token, UserRole.ADMIN);
        const users = await super.getAll() as IUser[];

        return users.map(user => toUserDTO(user));
    }

    async getUserByToken(token: string): Promise<UserDTO> {
        const { id } = await authService.verifyTokenAndGetData(token);
        const user = await this.findUserById(id);

        if (!user) {
            throw UserNotFoundError(id);
        }

        return toUserDTO(user);
    }

    async getUsersByRole(role: UserRole): Promise<UserDTO[]> {
        const users = await this.model.find({role}) as IUser[];

        return users.map(user => toUserDTO(user));
    }

    async sendPasswordResetCode(login: string) {
        const user = await this.findUserByLogin(login);

        if (!user) {
            throw new Error("User not found");
        }

        const resetCode = generateRandomCode(5);

        user.resetPassword = {
            resetCode,
            expire: new Date(Date.now() + 1000 * 60 * 2)
        }

        await user.save();

        return await sendPasswordCodeEmail(resetCode, user.email);
    }

    async sendEmailConfirmCode(email: string, token: string) {

        await authService.verifyTokenAndGetData(token);

        await emailValidate({email});

        const user = await this.findUserByEmail(email);

        if (!user) {
            throw UserNotFoundError(email, true)
        }

        const confirmationCode = generateRandomCode(6);

        user.emailConfirm = {
            confirmationCode,
            expire: new Date(Date.now() + 1000 * 60 * 2),
            confirmed: null
        }

        await user.save();

        return await sendPasswordCodeEmail(confirmationCode, email);
    }

    async confirmEmail(code: number, token: string) {
        const { id } = await authService.verifyTokenAndGetData(token);

        const user = await this.findUserById(id);

        if (!user) {
            throw UserNotFoundError(id);
        }

        if (user.emailConfirm?.confirmationCode !== code) {
            throw new Error("Invalid confirmation code.");
        }

        if (new Date() > user.emailConfirm.expire) {
            throw new Error("Confirmation code has expired.");
        }

        user.emailConfirm.confirmed = new Date();

        await user.save();

        return "Email successfully confirmed.";
    }

    async sendEmailConfirmLink(email: string, token: string) {
        await emailValidate({email});
        await authService.verifyTokenAndGetData(token);

        const appURL = this.getAppURL();

        const user = await this.findUserByEmail(email);

        if (!user) {
            throw UserNotFoundError(email, true)
        }

        const confirmToken = await authService.generateEmailConfirmToken(email);
        const confirmLink = `${appURL}/confirm-email/verified?token=${confirmToken}`;

        return await sendEmailWithLink(confirmLink, email);
    }

    async confirmEmailFromLink(email: string) {
        const user = await this.findUserByEmail(email);

        if (!user) {
            throw UserNotFoundError(email, true)
        }

        if (user.emailConfirm) {
            user.emailConfirm.confirmed = new Date();
        } else {
            user.emailConfirm = {
                confirmationCode: 0,
                expire: new Date(),
                confirmed: new Date()
            }
        }

        await user.save();

        return user.role;
    }

    async changePassword(data: ChangePasswordInput) {
        const { login, newPassword, resetCode } = data;

        const user = await this.findUserByLogin(login);

        if (!user) {
            throw UserNotFoundError(login);
        }

        if (user.resetPassword?.resetCode !== resetCode) {
            throw new Error("Invalid reset code.");
        }

        if (new Date() > user.resetPassword.expire) {
            throw new Error("Reset code has expired.");
        }

        user.passwordHash = await createPasswordHash(newPassword);
        await user.save();

        return "Password successfully changed.";
    }

    async changeRoleToModerator(email: string, token: string) {
        await authService.verifyTokenAndGetData(token);

        await emailValidate({email});

        const user = await this.findUserByEmail(email);

        if (!user) {
            throw UserNotFoundError(email, true)
        }

        user.role = UserRole.MODERATOR;

        await user.save();

        return "User successfully added as a moderator.";
    }

    async sendPhoneConfirm(phoneNumber: string, token: string) {
        const{ id } = await authService.verifyTokenAndGetData(token);

        const user = await this.findUserById(id);

        if (!user) {
            throw UserNotFoundError(id);
        }

        const confirmCode = generateRandomCode(5);

        if (user.address?.phoneNumber == phoneNumber) throw new Error("Phone number already exists.");

        const result = await sendPasswordCodeSMS(confirmCode, phoneNumber);

        user.phoneConfirm = {
            code: confirmCode,
            expire: new Date(Date.now() + 1000 * 60 * 2)
        }

        await user.save();

        return `${result.message}`;
    }

    async confirmPhone(data: ConfirmPhoneInput, token: string) {
        const { code, phoneNumber } = data;
        const { id } = await authService.verifyTokenAndGetData(token);

        const user = await this.findUserById(id);

        if (!user) {
            throw UserNotFoundError(id);
        }

        if (user.phoneConfirm?.code !== code) {
            throw new Error("Invalid confirmation code.");
        }

        if (new Date() > user.phoneConfirm.expire) {
            throw new Error("Confirmation code has expired.");
        }

        if (user.address) {
            user.address.phoneNumber = phoneNumber;
        } else {
            user.address = {
                city: "",
                street: "",
                phoneNumber
            };
        }

        user.phoneConfirm.confirmed = new Date();

        await user.save();

        return `Phone number ${user.address?.phoneNumber} successfully confirmed.`;
    }

    async getUsersByRoleWithFilter(data: GetAllWithFilters, userRole: UserRole) {
    // Існуючий код для фільтрації
    const filter = { role: userRole };
    // ... (існуючий код фільтрації)
    
    const sellers = await this.model.find(filter);

    // Агрегація для підрахунку проданих продуктів
    let salesCounts: any[] 
    if (userRole == UserRole.SELLER) {
    salesCounts = await PurchaseProduct.aggregate([
        { $match: { soldBy: { $in: sellers.map(s => s._id) } } },
        { $group: { _id: "$soldBy", soldORBoughtProducts: { $sum: 1 } } }
    ])} else{
        salesCounts = await PurchaseProduct.aggregate([
            { $match: { boughtBy: { $in: sellers.map(s => s._id) } } },
            { $group: { _id: "$boughtBy", soldORBoughtProducts: { $sum: 1 } } }
        ])
    }


    // Додавання інформації про продажі до продавців
    const enhancedSellers = sellers.map(seller => {
        const saleInfo = salesCounts.find(sale => sale._id.equals(seller._id));
        return {
            ...seller.toObject(),
            soldORBoughtProducts: saleInfo ? saleInfo.soldORBoughtProducts : 0
        };
    });


    return enhancedSellers.map(enhancedSeller => toUserDTOTsIgnore(enhancedSeller))
    }

    async newPasswordFromDashboard(oldPassword: string, newPassword: string, token: string) {
        const { id } = await authService.verifyTokenAndGetData(token);
        const user = await this.findUserById(id);

        if (!user) {
            throw UserNotFoundError(id);
        }

        const isPasswordValid = await comparePasswordHash(oldPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        user.passwordHash = await createPasswordHash(newPassword);
        await user.save();

        return newPassword;
    }

    async getSellerForAdmin(id: string, token: string): Promise<IUser | null> {
        await permissionCheck(token, UserRole.ADMIN);

        return await this.findUserById(id);
    }

    async confirmPaypalId(userId: string) {
       let user = await this.findUserById(userId);

       if (!user) {
           throw UserNotFoundError(userId);
       }

       if (user.paypalInfo?.paypalId) {
           user.paypalInfo.confirmed = new Date();
           await user.save();
       }

       return;
    }

    async getUserPercentStats(percentDays: number, role: UserRole) {
        const startDate = new Date(Date.now() - percentDays * 24 * 60 * 60 * 1000);
        const totalUsers = await this.model.countDocuments({ role });

        const recentUsers = await this.model.countDocuments({
            role,
            createdAt: { $gte: startDate }
        });

        const percent = totalUsers > 0 ? Math.round((recentUsers / totalUsers) * 100) : 0;

        return {
            total: totalUsers,
            percent
        };
    }

    async banUnbanUser(input: {userId: string, text: string}, ban: boolean) {
        const {userId, text} = input
        let user = await this.findUserById(userId);
 
        if (!user) {
            throw UserNotFoundError(userId);
        }
 
        if (ban) {
            user.banned = true;
            await sendBanNotification(user.email, text)
            await user.save();
        } else{
            user.banned = false;
            await sendBanNotification(user.email, text)
            await user.save();
        }
        
 
        return user;
     }

    async updateLastActivity(id: string) {
        const user = await this.findUserById(id) as IUser;

        user.lastActivity = new Date();

        await user.save();
    }

    getAppURL(): string {

        return process.env.NODE_ENV === 'production'
            ? process.env.FRONTEND_URL || 'defaultProductionURL'
            : process.env.LOCALHOST_URL || 'defaultTestURL';
    }

    private async findByField(field: Partial<UserCreationData>): Promise<IUser | null> {

        return this.model.findOne(field) as Promise<IUser | null>;
    }

    private async findUserByLogin(login: string) {
        if (await isEmail(login)) {

            return await this.findUserByEmail(login);
        } else {

            return await this.findUserByUserName(login);
        }
    }

    private async findUserByUserName(userName: string): Promise<IUser | null> {

        return this.findByField({userName});
    }
}
export default new UserService();
