import jwt from 'jsonwebtoken';
import { Payload, PayloadEmail } from "../inputs/PayloadTypes";

class AuthService {
    generateToken(id: string, name: string | undefined): string {
        const payload: Payload = { id, name };

        return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '12h' });
    }

    getDataFromToken(token: string): Payload | null {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as Payload;

            return { id: decoded.id, name: decoded.name };
        } catch (err) {
            console.log('Error decoding token: ', err);

            return null;
        }
    }

    verifyToken(token: string): boolean {
        try {
            jwt.verify(token, process.env.JWT_SECRET!);

            return true;
        } catch (err) {
            console.log('Error verifying token: ', err);

            return false;
        }
    }

    async verifyTokenAndGetData(token: string): Promise<Payload> {
        if (!this.verifyToken(token)) {
            throw new Error("Invalid or expired token.");
        }

        const data = this.getDataFromToken(token);
        if (!data) {
            throw new Error("Failed to extract data from token.");
        }

        return data;
    }

    async generateEmailConfirmToken(email: string): Promise<string> {
        const payload: PayloadEmail = { email };

        return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '24h' });
    }

    async verifyEmailConfirmToken(token: string): Promise<string> {
        if (!this.verifyToken(token)) {
            throw new Error("Invalid or expired token.");
        }

        const data = jwt.verify(token, process.env.JWT_SECRET!) as PayloadEmail;

        if (!data) {
            throw new Error("Failed to extract email from token.");
        }

        return data.email;
    }

    checkToken(token: string): string {
        if (!token) throw new Error('Token is missing.');
        return token;
    };
    
}

export const authService = new AuthService();
