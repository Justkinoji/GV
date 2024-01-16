import User from '../models/User';
import crypto from 'crypto';

async function userNameGenerator(email: string): Promise<string> {
    let baseUserName = email.split('@')[0];
    let userName = baseUserName;
    let attempt = 0;
    const MAX_ATTEMPTS = 10;

    while (attempt < MAX_ATTEMPTS) {
        const existingUser = await User.findOne({ userName: userName }).exec();
        if (!existingUser) {
            return userName;
        }

        const randomString = crypto.randomBytes(3).toString('hex');
        userName = `${baseUserName}_${randomString}`;

        attempt++;
    }

    throw new Error('Failed to generate a unique username');
}

export { userNameGenerator };
