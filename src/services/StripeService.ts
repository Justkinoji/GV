import { authService } from './AuthService';
import userService from "./UserService";
import stripeInstance from "../../config/stripeConnection";
import Product from "../models/Product";
import { UserNotFoundError } from "../errors/userErrors";
import { IUser } from "../interfaces/IUser";
import { IProduct } from "../interfaces/IProduct";
import User from '../models/User';
import Category from '../models/Category';

export const stripeService = {
    async connectUserToStripe(token: string) {
        const userData = authService.getDataFromToken(token);

        if (!userData) {
            throw new Error('Failed to get user data from token.');
        }

        const { id: currentUserId } = userData;

        const currentUser = await userService.findUserById(currentUserId);

        if (!currentUser) {
            throw UserNotFoundError(currentUserId);
        }

        let stripeAccount;

        if (currentUser.stripeId) {
            stripeAccount = { id: currentUser.stripeId };
        } else {
            stripeAccount = await this.createConnectAccount(currentUser);
            if (!stripeAccount || !stripeAccount.id) {
                throw new Error('Failed to create Stripe account for user.');
            }
        }

        const stripeLink = await this.getAccountLink(stripeAccount.id);
        if (!stripeLink) {
            throw new Error('Failed to get Stripe link.');
        }

        return stripeLink;
    },

    async removeUserFromStripe(token: string) {
        const userData = authService.getDataFromToken(token);

        if (!userData) {
            throw new Error('Failed to get user data from token.');
        }

        const { id: currentUserId } = userData;

        const currentUser = await userService.findUserById(currentUserId);

        if (!currentUser) {
            throw UserNotFoundError(currentUserId);
        }

        let info
        if (currentUser.stripeId) {
            info = this.deleteConnectedAccount(currentUser)
        } else {
            throw new Error('No Stripe Account found for your User');
        }

        return info;
    },

    // async createCheckoutSession(token: string, data: CheckoutSessionInput) {
    //     const products = await this.getProductsByIds(data.productIds);

    //     if (!products || products.length === 0) {
    //         throw new Error('No products found with the provided IDs.');
    //     }

    //     const lineItems = products.map(product => ({
    //         price: product.stripePriceId,
    //         quantity: 1
    //     }));

    //     const session = await stripeInstance.checkout.sessions.create({
    //         mode: 'payment',
    //         line_items: lineItems,
    //         payment_method_types: ['card'],
    //         success_url: `${process.env.FRONTEND_URL}/success`,
    //         cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    //     });

    //     return session.id;
    // },

    async createCheckoutSession(token: string, data: CheckoutSessionInput) {
        const product = await Product.findById(data.productId)

        if (!product) {
            throw new Error('No products found with the provided ID.');
        }
        
        const seller = await User.findById(data.sellerId)

        if (!seller) {
            throw new Error('No seller found with the provided ID.')
        }

        const category = await Category.findById(product.categoryId)

        if (!category) {
            throw new Error("We didn't found such category")
        }

        const session = await stripeInstance.checkout.sessions.create(
            {
              mode: 'payment',
              line_items: [
                {
                  price: product.stripePriceId,
                  quantity: 1,
                },
              ],
              payment_intent_data: {
                application_fee_amount: category.fee,
              },
              success_url: process.env.SUCCESS_PAYMENT as string,
              cancel_url: process.env.CANCEL_PAYMENT as string,
            },
            {
              stripeAccount: seller.stripeId,
            }
          );

        console.log(session)

        return session.id;
    },

    async createConnectAccount(user: IUser) {
        const account = await stripeInstance.accounts.create({
            type: 'standard',
        });

        if (!account || !account.id) {
            throw new Error('Failed to create Stripe account.');
        }

        user.stripeId = account.id;
        await user.save();

        return account;
    },

    async deleteConnectedAccount(user: IUser) {
        const {id, ...rest} = await stripeInstance.accounts.del(String(user.stripeId));

        if (!rest.deleted) {
            throw new Error('Failed to delete Stripe account.');
        }

        user.stripeId = ""
        await user.save();

        return { stripeId: id, ...rest };
    },

    async getAccountLink(accountId: string) {
        const accountLink = await stripeInstance.accountLinks.create({
            account: accountId,
            refresh_url: process.env.CUSTOM_STRIPE_REFRESH_URL,
            return_url: process.env.CUSTOM_STRIPE_RETURN_URL,
            type: 'account_onboarding',
        });
        return accountLink.url;
    },

    async getAcceptPayments(token: string) {
        const userData = authService.getDataFromToken(token);
        if (!userData) {
            throw new Error('Failed to get user data from token.');
        }
        const { id: currentUserId } = userData;
        const currentUser = await userService.findUserById(currentUserId);

        if (!currentUser) {
            throw UserNotFoundError(currentUserId);
        }

        const account = await stripeInstance.accounts.retrieve(String(currentUser?.stripeId));
        
        if (!account) {
            throw new Error('Such account is undefined');
        }
        
        return account.payouts_enabled
    },

    async getUserAcceptPayments(userId: string) {
        const currentUser = await userService.findUserById(userId);

        if (!currentUser) {
            throw UserNotFoundError(userId);
        }

        const account = await stripeInstance.accounts.retrieve(String(currentUser?.stripeId));
        
        if (!account) {
            throw new Error('Such account is undefined');
        }
        
        return account.payouts_enabled
    }
};
