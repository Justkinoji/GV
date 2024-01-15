import ProductService from "../../services/ProductService";
import {authService} from "../../services/AuthService";

const productQueryResolver = {
    Query: {
        async getAllProducts(_: any, { section }: { section: string }, ___: any) {
            try {

                return await ProductService.getAllProducts(section);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong when getting all products');
            }
        },

        async getOneProduct(_: any, { id }: { id: string }, ___: any) {
            try {

                return await ProductService.getOneProduct(id);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong when getting one product');
            }
        },

        async getMyOneProduct(_: any, { id }: { id: string }, context: any) {
            try {

                const token = authService.checkToken(context.token);

                return await ProductService.getMyOneProduct(id, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong when getting my one product');
            }
        },

        async getMyProducts(_: any, __: any, context: any) {
            const token = authService.checkToken(context.token);
            try {

                return await ProductService.getMyProducts(token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong when getting my products');
            }
        },

        async getSellerProducts(_: any, { id }: { id: string }, ___: any) {
            try{

                return await ProductService.getSellerProducts(id);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong when getting seller products');
            }
        }
    }
}

export default productQueryResolver;
