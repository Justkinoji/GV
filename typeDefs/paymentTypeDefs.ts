export const paymentTypeDefs = `
type StripeResponse {
    stripeLink: String!
    message: String!
}

type RemoveStripeResponse {
    stripeId: String!
    deleted: Boolean!
}

input CheckoutSessionInput {
    productId: String
    sellerId: String
}

input PaypalPaymentInput {
    productId: String!
}

type CheckoutSessionResponse {
    sessionId: String!
    message: String!
}

type PayPallResponse {
    url: String!
    message: String!
}

type OnboardSellerResponse {
    id: String
    status: String
    link: String
    actionUrl: String
    referralId: String
}

type Mutation {
    connectStripe: StripeResponse!
    deleteStripe: RemoveStripeResponse!
    createCheckoutSession(input: CheckoutSessionInput): CheckoutSessionResponse
    createPaypalPayment(input: PaypalPaymentInput): PayPallResponse
    onboardSeller: OnboardSellerResponse
    deletePaypal: String
}

type Query {
    getAcceptPayments: Boolean!
    getUserAcceptPayments(userId: ID): Boolean!
}
`;