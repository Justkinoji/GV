import { clearDatabase, closeDatabase, connect } from '../../config/jest.mongo.setup';
import {
    createTestAdmin,
    createTestCategory,
    createTestProduct,
    createTestSection,
    createTestSeller
} from "./testDataHelpers";
import {Platform} from "../constants/Platform";
import productMutationResolver from "../resolvers/products/productMutationResolver";
import ProductService from "../services/ProductService";
import {ContextType} from "./typesForTests";
import {ProductResponse} from "../inputs/productInterfaces";
import {ISection} from "../interfaces/ISection";
import {ICategory} from "../interfaces/ICategory";

let context: ContextType;
let section: ISection;
let category: ICategory;
let product: ProductResponse;

beforeAll(async () => await connect());

beforeEach(async () => {
    context = { token: await createTestAdmin() };
    section = await createTestSection(context);
    category = await createTestCategory(context, section);
    context = { token: await createTestSeller() };
    product = await createTestProduct(context, section, category);
});

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe('Product Mutation Resolvers', () => {
    it('should create a new product', async () => {

        expect(product.price).toBe(100);
        expect(product.platform).toBe(Platform.XBOX);
        expect(product.id).not.toBeNull();

        const fetchedProduct = await ProductService.getOneProduct(product.id);
        expect(fetchedProduct).not.toBeNull();
    });

    it('should update the product', async () => {

        const updatedProduct = {
            id: product.id,
            price: 200,
            imageUrl: 'some image url',
            categoryId: category._id.toString(),
            sectionId: section._id.toString(),
            description: {
                en: 'some description',
                sh: 'some description',
                pt: 'some description',
                ar: 'some description',
                ru: 'some description',
                es: 'some description'
            },
            shortDescription: {
                en: 'some description',
                sh: 'some description',
                pt: 'some description',
                ar: 'some description',
                ru: 'some description',
                es: 'some description'
            },
            platform: Platform.XBOX,
            sold: false,
            quantity: 10
        };

        const result = await productMutationResolver.Mutation.changeProduct(null, { input: updatedProduct }, context);

        expect(result?.price).toBe(updatedProduct.price);
        expect(result?.platform).toBe(updatedProduct.platform);

        const fetchedUpdatedProduct = await ProductService.getOneProduct(product.id);
        expect(fetchedUpdatedProduct?.shortDescription.en).toBe(updatedProduct.shortDescription.en);
    });

    it('should delete the product', async () => {

        const id = product.id.toString();
        const args = { id };
        await productMutationResolver.Mutation.deleteProduct(null, args, context);


        const deletedProduct = await ProductService.getByID(id);
        expect(deletedProduct).toBeNull();
    });
});
