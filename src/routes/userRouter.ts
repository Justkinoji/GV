import { authService } from "../services/AuthService";
import userService from "../services/UserService";
import express from "express";
import { getAppURL } from "../utils/getAppURL";
import { UserRole } from "../constants/UserRole";

const router = express.Router();

const initAppURL = async () => {
    const appURL = await getAppURL();

    router.get('/confirm-email', async (req, res) => {
        const token = req.query.token;

        if (!token) {
            return res.status(400).send('Token not provided');
        }

        const email = await authService.verifyEmailConfirmToken(token.toString());

        if (!email) {
            return res.status(400).send('Invalid or expired token');
        }

        try {
            const role = await userService.confirmEmailFromLink(email);

            if (role === UserRole.SELLER) {
                res.redirect(`${appURL}/confirm-phone`);
            } else {
                res.redirect(`${appURL}/confirm-email/verified`);
            }
        } catch (error) {
            res.status(500).send(error);
        }
    });
};

initAppURL().then(r => console.log(r));

export default router;
