import ReviewService from "../../services/ReviewService";
import { authService } from "../../services/AuthService";

const reviewQueryResolver = {
    Query: {
        getAllReviews: async (_: any, __: any, ___: any) => {
           try {

               return await ReviewService.getAll();
           } catch (error) {
               console.error('Error:', error);
               throw new Error('Something went wrong getting the reviews. Please try again.');
           }
        },

        getMyReviews: async (_: any, __: any, context: any) => {
            const token = authService.checkToken(context.token);

            try{

                return await ReviewService.getMyReviews(token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong getting the reviews. Please try again.');
            }
        },

        getSentReviews: async (_: any, __: any, context: any) => {
            const token = authService.checkToken(context.token);

            try {

                return await ReviewService.getSentReviews(token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong getting the reviews. Please try again.');
            }
        },

        getUserReviews: async (_: any, { id }: { id: string }, context: any) => {
            authService.checkToken(context.token);

            try {

                return await ReviewService.getUserReviews(id);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong getting the reviews. Please try again.');
            }
        }
    }
}

export default reviewQueryResolver;
