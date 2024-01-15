import { stripeService } from "../../services/StripeService";

const paymentQueryResolver = {
    Query: {
        getAcceptPayments: async (_: any, __: any, context: any) => {
            try {
                const answer = stripeService.getAcceptPayments(context.token);
                return answer
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        },

        getUserAcceptPayments: async (_: any, {userId}: {userId: string}, context: any) => {
            try {
                const answer = stripeService.getUserAcceptPayments(userId);
                return answer
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        },
    }
}

export default paymentQueryResolver;
