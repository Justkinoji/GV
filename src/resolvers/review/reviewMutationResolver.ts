import { ReviewData } from "../../inputs/reviewInterfaces";
import { authService } from "../../services/AuthService";
import ReviewService from "../../services/ReviewService";

const reviewMutationResolver = {
    Mutation: {
        async createReview(_: any, { input }: { input: ReviewData }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await ReviewService.createReview(input, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong creating the review. Please try again.');
            }
        },
    }
}

export default reviewMutationResolver;