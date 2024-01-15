import {authService} from "../../services/AuthService";
import {stripeService} from "../../services/StripeService";
import {paypalService} from "../../services/PaypalService";

const paymentMutationResolver = {
    Mutation: {
        async connectStripe(_: any, __: any, context: any) {
            const token = authService.checkToken(context.token);

            try {

                const stripeLink = await stripeService.connectUserToStripe(token);

                return {
                    stripeLink,
                    message: "Successfully created Stripe connection link."
                };
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to connect Stripe API for current user.');
            }
        },
        
        async deleteStripe(_: any, __: any, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await stripeService.removeUserFromStripe(token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to connect Stripe API for current user.');
            }
        },

        async createCheckoutSession(_: any, { input }: { input: CheckoutSessionInput }, context: any) {
            const token = authService.checkToken(context.token);

            try {
                const sessionId = await stripeService.createCheckoutSession(token, input);

                return {
                    sessionId,
                    message: "Successfully created checkout session."
                };
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to create checkout session.');
            }
        },

        async createPaypalPayment(_: any, { input }: { input: PaypalPaymentInput }, context: any) {
            const token = authService.checkToken(context.token);

            try {
                const payment = await paypalService.createPayment(token, input.productId);

                let approvalUrl;
                if (payment.links) {
                    approvalUrl = payment.links.find(link => link.rel === "approval_url");
                }


                if (!approvalUrl) {
                    console.error('Failed to retrieve approval URL from PayPal payment.');
                    return {
                        error: "Failed to retrieve approval URL from PayPal payment.",
                    };
                }

                return {
                    url: approvalUrl.href,
                    message: "Successfully created PayPal payment."
                };
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to create PayPal payment.');
            }
        },

        async onboardSeller(_: any, __: any, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await paypalService.onboardSeller(token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to onboard seller.');
            }
        },

        async deletePaypal(_: any, __: any, context: any) {
            const token = authService.checkToken(context.token);
            try {

                return await paypalService.disableAccount(token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to disable PayPal account');
            }
        }
    }
}

export default paymentMutationResolver;