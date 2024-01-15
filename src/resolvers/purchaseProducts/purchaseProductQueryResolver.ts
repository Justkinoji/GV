import { authService } from "../../services/AuthService";
import PurchaseProductService from "../../services/PurchaseProductService";
import { getTopSellersOrBuyersInput } from "../../inputs/purchaseProductTypes";

const purchaseProductQueryResolver = {
    Query: {
        async getMyBoughtProducts (_: any, __: any, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await PurchaseProductService.getMyBoughtProducts(token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong when getting all products');
            }
        },

        async getMySoldProducts (_: any, __: any, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await PurchaseProductService.getMySoldProducts(token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong when getting all products');
            }
        },

        async getOnePurchase (_: any, { id }: { id: string }) {
            try {

                return await PurchaseProductService.getOnePurchaseProduct(id);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong when getting all products');
            }
        },

        async getAllUsersPurchases (_: any, __: any, context: any) {
            authService.checkToken(context.token);
            try {

                return await PurchaseProductService.getAllUsersPurchases();
            } catch (error) {
                console.error('Error:', error);
            }
        },

        async getTopSellers (_: any, { input }: { input: getTopSellersOrBuyersInput }, context: any) {
            authService.checkToken(context.token);
            try {

                return await PurchaseProductService.getTopSellers(input);
            } catch (error) {
                console.error('Error:', error);
            }
        },

        async getTopBuyers (_: any, { input }: { input: getTopSellersOrBuyersInput }, context: any) {
            authService.checkToken(context.token);
            try {

                return await PurchaseProductService.getTopBuyers(input);
            } catch (error) {
                console.error('Error:', error);
            }
        },

        async getUserPurchases (_: any, { userId }: { userId: string }, context: any) {
            authService.checkToken(context.token);
            try {

                return await PurchaseProductService.getUserPurchases(userId);
            } catch (error) {
                console.error('Error:', error);
            }
        },

        async getAllPurchases (_: any, __: any, context: any) {
            const token = authService.checkToken(context.token);
            try {
                return await PurchaseProductService.getAllPurchases(token);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
}

export default purchaseProductQueryResolver;
