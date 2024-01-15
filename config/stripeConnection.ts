import Stripe from 'stripe';
import { IStripeEnvironment } from "../src/interfaces/IStripeEnvironment";

function getEnvironmentVariables(): IStripeEnvironment {
    const { STRIPE_SECRET_KEY, STRIPE_API_VERSION } = process.env;

    if (!STRIPE_SECRET_KEY || !STRIPE_API_VERSION) {
        throw new Error('Required environment variables are missing!');
    }

    return {
        STRIPE_SECRET_KEY,
        STRIPE_API_VERSION,
    };
}

const { STRIPE_SECRET_KEY, STRIPE_API_VERSION } = getEnvironmentVariables();

const stripeInstance = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: STRIPE_API_VERSION as any,
});

export default stripeInstance;
