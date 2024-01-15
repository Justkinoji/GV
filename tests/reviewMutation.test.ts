import { clearDatabase, closeDatabase, connect } from "../../config/jest.mongo.setup";
import { createTestBuyer, createTestSeller } from "./testDataHelpers";
import UserService from "../services/UserService";
import { Rating } from "../constants/Rating";
import reviewMutationResolver from "../resolvers/review/reviewMutationResolver";
import { ContextType } from "./typesForTests";

describe('Review Mutation Resolvers', () => {

    let reviewerContext: ContextType;
    let reviewedUserContext: ContextType;

    beforeAll(async () => await connect());

    beforeEach(async () => {
        reviewerContext = { token: await createTestSeller() };
        reviewedUserContext = { token: await createTestBuyer() };
    });

    afterEach(async () => await clearDatabase());

    afterAll(async () => await closeDatabase());

    it('should create a review', async () => {
        const reviewedUser = await UserService.findUserByEmail("buyer@gmail.com");

        expect(reviewedUser).not.toBeNull();

        const reviewInput = {
            receivedBy: reviewedUser?.id,
            text: 'Excellent buyer!',
            rating: Rating.Two
        };

        const result = await reviewMutationResolver.Mutation.createReview(null, { input: reviewInput }, reviewerContext);

        expect(result).not.toBeNull();
        expect(result.id).toBeDefined();
        expect(result.receivedBy.userName).toEqual(reviewedUser?.userName);
        expect(result.text).toEqual(reviewInput.text);
        expect(result.rating).toEqual(reviewInput.rating);
    });
});
