import {
    createTestAdmin,
    createTestBuyer,
    createTestSeller,
    createTestCategory,
    createTestProduct,
    createTestSection
} from "./testDataHelpers";
import { clearDatabase, closeDatabase, connect } from '../../config/jest.mongo.setup';
import PurchaseProductService from "../services/PurchaseProductService";
import purchaseProductMutationResolver from "../resolvers/purchaseProducts/purchaseProductMutationResolver";
import userService from "../services/UserService";
import { ContextType } from "./typesForTests";
import { PurchaseProductInput } from "../inputs/purchaseProductTypes";
import { ISection } from "../interfaces/ISection";
import { ICategory } from "../interfaces/ICategory";
import { ProductResponse } from "../inputs/productInterfaces";
import { UserDTO } from "../interfaces/UserDTO";

let context: ContextType;
let buyerContext: ContextType;
let section: ISection;
let category: ICategory;
let product: ProductResponse;
let purchaseProduct: PurchaseProductInput;
let seller: UserDTO;

beforeAll(async () => await connect());

beforeEach(async () => {
    buyerContext = { token: await createTestBuyer() };

    context = { token: await createTestAdmin() };
    section = await createTestSection(context);
    category = await createTestCategory(context, section);
    context = { token: await createTestSeller() };
    product = await createTestProduct(context, section, category);
    seller = await userService.getUserByToken(context.token);

    purchaseProduct = {
        productId: product.id,
        soldBy: seller.id,
        payment: {
            method: 'STRIPE',
            paymentCode: '12345',
        },
        status: 'PENDING',
        received: true,
        acceptedAt: new Date(),
        price: product.price,
    };

    context = buyerContext;
});

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe('PurchaseProduct Mutation Resolvers', () => {
    it('should create a new purchase', async () => {
        const result = await purchaseProductMutationResolver.Mutation.createPurchaseProduct(null, { input: purchaseProduct }, context);
        expect(result?.price).toBe(purchaseProduct.price);
        expect(result?.productId.id).toBe(purchaseProduct.productId);

        if (!result || !result.id) {
            throw new Error("Expected result and result.id to be defined");
        }
        const fetchedPurchaseProduct = await PurchaseProductService.getOnePurchaseProduct(result.id);

        expect(fetchedPurchaseProduct).not.toBeNull();
    });

    it('should update the purchase', async () => {
        const initialPurchase = await purchaseProductMutationResolver.Mutation.createPurchaseProduct(null, { input: purchaseProduct }, context);

        if (!initialPurchase || !initialPurchase.id) {
            throw new Error("Expected initialPurchase and initialPurchase.id to be defined");
        }

        const updatedPurchaseProduct = {
            ...purchaseProduct,
            id: initialPurchase.id,
            received: false
        };

        const result = await purchaseProductMutationResolver.Mutation.changePurchaseProduct(null, { input: updatedPurchaseProduct }, context);

        expect(result?.received).toBe(updatedPurchaseProduct.received);

        const fetchedUpdatedPurchaseProduct = await PurchaseProductService.getOnePurchaseProduct(result?.id);
        expect(fetchedUpdatedPurchaseProduct?.received).toBe(updatedPurchaseProduct.received);
    });
});

