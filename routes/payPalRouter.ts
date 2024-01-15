import express from 'express';
import userService from "../src/services/UserService";

const router = express.Router();

router.get('/seller-onboarded-success', (req, res) => {
    console.log('Seller successfully onboarded');
    const userId = req.query.userId as string;

    if (!userId) {
        console.error('userId not provided in the URL.');
        res.status(400).send('Error: userId not provided.');
        return;
    }

    userService.confirmPaypalId(userId).then(() => {
        res.send('Seller successfully onboarded');
    })

});

router.get('/renew-expired-url', (req, res) => {
    console.log('URL renewal requested');
    console.log('req', req);
    res.send('URL renewal requested');
});

export default router;
