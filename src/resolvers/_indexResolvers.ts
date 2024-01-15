import achievementMutationResolver from "./achievements/achievementMutationResolver";
import achievementQueryResolver from "./achievements/achievementQueryResolver";
import categoryMutationResolver from "./category/categoryMutationResolver";
import categoryQueryResolver from "./category/categoryQueryResolver";
import chatQueryResolver from "./chats/chatQueryResolver";
import messageMutationResolver from "./messages/messageMutationResolver";
import messageQueryResolver from "./messages/messageQueryResolver";
import messageSubscriptionResolver from "./messages/messageSubscriptionResolver";
import paymentMutationResolver from "./payments/paymentMutationResolver";
import productMutationResolver from "./products/productMutationResolver";
import productQueryResolver from "./products/productQueryResolver";
import purchaseProductMutationResolver from "./purchaseProducts/purchaseProductMutationResolver";
import purchaseProductQueryResolver from "./purchaseProducts/purchaseProductQueryResolver";
import reportMutationResolver from "./report/reportMutationResolver";
import reportQueryResolver from "./report/reportQueryResolver";
import reviewMutationResolver from "./review/reviewMutationResolver";
import reviewQueryResolver from "./review/reviewQueryResolver";
import sectionMutationResolver from "./section/sectionMutationResolver";
import sectionQueryResolver from "./section/sectionQueryResolver";
import sessionSecretMutationResolver from "./sessionSecret/sessionSecretMutationResolvers";
import userMutationResolver from "./users/userMutationResolver";
import userQueryResolver from "./users/userQueryResolver";
import paymentQueryResolver from "./payments/paymentQueryResolver";
import webStatsQueryResolver from "./webStats/webStatsQueryResolver";

export const resolversArray = {
    Query: {
        ...userQueryResolver.Query,
        ...chatQueryResolver.Query,
        ...messageQueryResolver.Query,
        ...reportQueryResolver.Query,
        ...sectionQueryResolver.Query,
        ...categoryQueryResolver.Query,
        ...achievementQueryResolver.Query,
        ...categoryQueryResolver.Query,
        ...reviewQueryResolver.Query,
        ...productQueryResolver.Query,
        ...purchaseProductQueryResolver.Query,
        ...paymentQueryResolver.Query,
        ...webStatsQueryResolver.Query
    },
    Mutation: {
        ...userMutationResolver.Mutation,
        ...sessionSecretMutationResolver.Mutation,
        ...messageMutationResolver.Mutation,
        ...reviewMutationResolver.Mutation,
        ...messageMutationResolver.Mutation,
        ...sectionMutationResolver.Mutation,
        ...categoryMutationResolver.Mutation,
        ...achievementMutationResolver.Mutation,
        ...categoryMutationResolver.Mutation,
        ...reportMutationResolver.Mutation,
        ...productMutationResolver.Mutation,
        ...paymentMutationResolver.Mutation,
        ...purchaseProductMutationResolver.Mutation
    },
    Subscription: {
        ...messageSubscriptionResolver.Subscription
    }
};
