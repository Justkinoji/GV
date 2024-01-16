export function updateUserFields(user: any, data: any): void {
    if (data.userName) user.userName = data.userName;
    if (data.avatarURL) user.avatarURL = data.avatarURL;
    if (data.backgroundColor) user.backgroundColor = data.backgroundColor;
    if (data.backgroundImage) user.backgroundImage = data.backgroundImage;
    if (data.confidentLvl) user.confidentLvl = data.confidentLvl;
    if (data.bonuses) user.bonuses = data.bonuses;
    if (data.level) user.level = data.level;
    if (data.experience) user.experience = data.experience;
    if (data.role) user.role = data.role;
    if (data.achievements) user.achievements = data.achievements;
    updateBooleanFields(user, data);
    updateAddress(user, data.address);
}

function updateBooleanFields(user: any, data: any): void {
    if (typeof data.isTwoFactorEnabled !== 'undefined') user.isTwoFactorEnabled = data.isTwoFactorEnabled as boolean;
    if (data.qrCode) user.qrCode = data.qrCode;
    if (typeof data.subscribed !== 'undefined') user.subscribed = data.subscribed as boolean;
}

function updateAddress(user: any, address?: any): void {
    if (address && user.address) {
        if (address.city) user.address.city = address.city;
        if (typeof address.zipCode !== 'undefined') user.address.zipCode = address.zipCode;
        if (address.street) user.address.street = address.street;
        if (address.phoneNumber) user.address.phoneNumber = address.phoneNumber;
    }
}
