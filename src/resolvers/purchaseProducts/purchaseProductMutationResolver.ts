import { authService } from "../../services/AuthService";
import PurchaseProductService from "../../services/PurchaseProductService";
import { PurchaseProductInput, SellerSendDetailsInput } from "../../inputs/purchaseProductTypes";

    const purchaseProductMutationResolver = {
    Mutation: {
        async createPurchaseProduct(_: any, { input }: { input: PurchaseProductInput }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await PurchaseProductService.createPurchaseProduct(input, token);
            } catch (error) {
                if (error instanceof Error) {
                    if (error.message && error.message.includes("Argument passed in must be a string of 12 bytes or a string of 24 hex characters")) {
                        throw new Error('Invalid product identifier provided');
                    }
                } else {
                    console.error('Caught a non-Error throw:', error);
                    throw new Error('An unexpected error occurred');
                }
            }
        },

        async changePurchaseProduct(_: any, { input }: { input: PurchaseProductInput }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await PurchaseProductService.updatePurchaseProduct(input, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong when changing a purchase product');
            }
        },

        async sellerSendDetails(_: any, { input }: { input: SellerSendDetailsInput }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await PurchaseProductService.sellerSendDetails(input, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong when changing a purchase product');
            }
        }
    }
}

export default purchaseProductMutationResolver;
