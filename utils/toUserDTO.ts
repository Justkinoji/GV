import { IUser } from "../interfaces/IUser";
import { UserDTO } from "../interfaces/UserDTO";

export function toUserDTO(user: IUser): UserDTO {
    const ratingsStatsArray = user.ratingsStats ? Object.entries(user.ratingsStats).map(([key, value]) => ({
        key: parseInt(key),
        value
    })) : [];

    return {
        id: user._id.toString(),
        userName: user.userName,
        email: user.email,
        emailConfirmDate: user.emailConfirm?.confirmed || null,
        avatarURL: user.avatarURL,
        backgroundColor: user.backgroundColor,
        backgroundImage: user.backgroundImage,
        confidentLvl: user.confidentLvl,
        bonuses: user.bonuses,
        level: user.level,
        experience: user.experience,
        role: user.role,
        achievements: user.achievements ? [user.achievements.toString()] : undefined,
        ratingsStats: {entries: ratingsStatsArray},
        isTwoFactorEnabled: user.isTwoFactorEnabled,
        qrCode: user.qrCode,
        address: user.address,
        phoneConfirmDate: user.phoneConfirm?.confirmed || null,
        subscribed: user.subscribed,
        stripeId: user.stripeId,
        paypalInfo: user.paypalInfo,
        lastActivity: user.lastActivity,
        createdAt: user.createdAt
    };
}

export function toUserDTOTsIgnore(user: any): any {
    const ratingsStatsArray = user.ratingsStats ? Object.entries(user.ratingsStats).map(([key, value]) => ({
        key: parseInt(key),
        value
    })) : [];

    return {
        id: user._id.toString(),
        userName: user.userName,
        email: user.email,
        emailConfirmDate: user.emailConfirm?.confirmed || null,
        avatarURL: user.avatarURL,
        backgroundColor: user.backgroundColor,
        backgroundImage: user.backgroundImage,
        confidentLvl: user.confidentLvl,
        bonuses: user.bonuses,
        level: user.level,
        experience: user.experience,
        role: user.role,
        achievements: user.achievements ? [user.achievements.toString()] : undefined,
        ratingsStats: {entries: ratingsStatsArray},
        isTwoFactorEnabled: user.isTwoFactorEnabled,
        qrCode: user.qrCode,
        address: user.address,
        phoneConfirmDate: user.phoneConfirm?.confirmed || null,
        subscribed: user.subscribed,
        stripeId: user.stripeId,
        paypalInfo: user.paypalInfo,
        lastActivity: user.lastActivity,
        createdAt: user.createdAt,
        soldORBoughtProducts: user.soldORBoughtProducts
    };
}
