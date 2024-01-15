import axios from 'axios';
import { Payment } from "paypal-rest-sdk";
import paypal from "../../config/paypalConnection";
import productService from "./ProductService";
import userService from "./UserService";
import UserService from "./UserService";
import { Language } from "../constants/Language";
import {authService} from "./AuthService";
import {UserNotFoundError} from "../errors/userErrors";

export const paypalService = {
    async createPayment(token: string, productId: string): Promise<Payment> {
        const product = await productService.getOneProduct(productId);
        const seller = await UserService.getByID(product.createdBy.toString());

        if (!seller || !seller.paypalInfo || !seller.paypalInfo.paypalId) {
            throw new Error('Unable to fetch PayPal ID of the seller.');
        }

        const items = [{
            name: product.shortDescription[Language.EN],
            price: product.price.toFixed(2),
            currency: 'USD',
            quantity: 1
        }];

        const create_payment_json: Payment = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            transactions: [{
                item_list: {
                    items: items
                },
                amount: {
                    currency: 'USD',
                    total: product.price.toFixed(2)
                },
                description: 'Payment description',
                payee: {
                    email: seller.email,
                    merchant_id: seller.paypalInfo.paypalId,
                }
            }],
            redirect_urls: {
                return_url: `${process.env.FRONTEND_URL}/success`,
                cancel_url: `${process.env.FRONTEND_URL}/cancel`
            },
        };

        return await new Promise<Payment>((resolve, reject) => {
            paypal.payment.create(create_payment_json, (error, payment) => {
                if (error) {
                    console.log('error', error);
                    reject(error);
                } else {
                    resolve(payment);
                }
            });
        });
    },

    async onboardSeller(token: string): Promise<any> {
        const baseURL = this.getPayPalBaseURL();
        const appUrl = this.getAppURL();
        const data = await authService.getDataFromToken(token);
        if (!data) {
            throw new Error("Invalid token or token has expired");
        }
        const { id: userId } = data;
        let user = await userService.findUserById(userId);

        if (!user) {
            throw UserNotFoundError(userId);
        }

        const referralData = {
            "email": user.email || '',
            "operations": [
                {
                    "operation": "BANK_ADDITION"
                }
            ],
            "partner_config_override": {
                "return_url": `${appUrl}/paypal/seller-onboarded-success?userId=${user.id}`,
                "return_url_description": "URL for successful onboarding",
                "action_renewal_url": `${appUrl}/paypal/renew-expired-url`,
            },
            "legal_consents": [
                {
                    "type": "SHARE_DATA_CONSENT",
                    "granted": true
                }
            ]
        };

        const accessToken = await this.getPayPalToken();

        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        };

        try {
            const response = await axios.post(`${baseURL}/v2/customer/partner-referrals`, referralData, config);

            const links = response.data.links;
            const link = links.find((link: any) => link.rel === 'self')?.href || '';
            const partnerReferralId = link.split('/partner-referrals/')[1];

            const accountId = (await this.getPaypalUserData(partnerReferralId, accessToken)).toString();

            if (user.paypalInfo) {
                user.paypalInfo.paypalId = accountId;
            } else {
                user.paypalInfo = { paypalId: accountId };
            }

            await userService.updateByID(user.id, user);

            return {
                id: user.id || '',
                status: response.statusText || '',
                link: links.find((link: any) => link.rel === 'self')?.href || '',
                actionUrl: links.find((link: any) => link.rel === 'action_url')?.href || '',
                referralId: partnerReferralId || ''
            };
        } catch (error) {
            console.log('error', error);
            throw error;
        }
    },

    async getPaypalUserData(partnerReferralId: string, accessToken: string): Promise<String> {
        const baseURL = this.getPayPalBaseURL();
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        };

        try {
            const response = await axios.get(`${baseURL}/v2/customer/partner-referrals/${partnerReferralId}`, config);

            return response.data.submitter_payer_id;
        } catch (error) {
            console.error('Error fetching PayPal user data:', error);
            throw error;
        }
    },

    async getPayPalToken(): Promise<string> {
        const baseURL = this.getPayPalBaseURL();
        const clientId = process.env.PAYPAL_CLIENT_ID;
        const secret = process.env.PAYPAL_CLIENT_SECRET;

        const basicAuth = Buffer.from(`${clientId}:${secret}`).toString('base64');

        try {
            const response = await axios.post(`${baseURL}/v1/oauth2/token`, 'grant_type=client_credentials', {
                headers: {
                    'Authorization': `Basic ${basicAuth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            });

            return response.data.access_token;
        } catch (error) {
            if (error instanceof Error) {
                console.log('error in getPayPalToken', error);
                throw new Error(`Failed to obtain PayPal access token: ${error.message}`);
            } else {
                throw new Error(`Failed to obtain PayPal access token`);
            }
        }
    },

    getPayPalBaseURL(): string {
        return process.env.NODE_ENV === 'production'
            ? process.env.PAYPAL_API || 'defaultProductionURL'
            : process.env.PAYPAL_TEST_API || 'defaultTestURL';
    },

    getAppURL(): string {
        return process.env.NODE_ENV === 'production'
            ? process.env.FRONTEND_URL || 'defaultProductionURL'
            : process.env.LOCALHOST_URL || 'defaultTestURL';
    },

    async disableAccount(token: string): Promise<string>  {
        const data = await authService.getDataFromToken(token);
        if (!data) {
            throw new Error("Invalid token or token has expired");
        }
        const { id: userId } = data;
        let user = await userService.findUserById(userId);

        if (!user) {
            throw UserNotFoundError(userId);
        }
        
        if (!user.paypalInfo?.paypalId) {
            throw new Error ("This user don't have a connected Paypal account")
        }

        user.paypalInfo.paypalId = "";

        await user.save();
        return "User successfully disable PayPal account"
    }
};
