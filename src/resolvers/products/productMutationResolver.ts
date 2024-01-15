import { authService } from "../../services/AuthService";
import ProductService from "../../services/ProductService";
import { ProductCreateInput } from "../../inputs/productInterfaces";

    const productMutationResolver = {
    Mutation: {
        async createProduct(_: any, { input }: { input: ProductCreateInput }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await ProductService.createProduct(input, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong when creating a new product');
            }
        },

        async changeProduct(_: any, { input }: { input: ProductCreateInput }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await ProductService.changeProduct(input, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong when changing a product');
            }
        },

        async deleteProduct(_: any, { id }: { id: string }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await ProductService.deleteProduct(id, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong when deleting a product');
            }
        }
    }
}

export default productMutationResolver;