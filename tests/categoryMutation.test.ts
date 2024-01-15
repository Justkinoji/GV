import { clearDatabase, closeDatabase, connect } from '../../config/jest.mongo.setup';
import categoryMutationResolver from "../resolvers/category/categoryMutationResolver";
import CategoryService from "../services/CategoryService";
import { createTestAdmin, createTestCategory, createTestSection } from "./testDataHelpers";
import { ContextType } from "./typesForTests";

let context: ContextType;

beforeAll(async () => await connect());

beforeEach(async () => {
    context = { token: await createTestAdmin() };
});

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe('Category Mutation Resolvers', () => {
    it('should create a new category', async () => {
        const section = await createTestSection(context);

        const category = await createTestCategory(context, section);

        expect(category.name).toBe('Test Category');
        expect(category.sectionId.toString()).toBe(section._id.toString());

        const fetchedCategory = await CategoryService.getBySection(section.name);
        expect(fetchedCategory).not.toBeNull();
    });

    it('should update the category', async () => {
        const section = await createTestSection(context);

        const category = await createTestCategory(context, section);

        const updatedCategory = {
            _id: category._id.toString(),
            name: 'Updated Category',
            description: 'This is an updated test category',
            imageUrl: 'https://updatedimage.com',
            filters: {
                inputFields: [{ placeholder: "Updated Field", field: "updatedField" }],
                selects: [],
                minMax: []
            }
        };

        const args = { input: updatedCategory };
        const result = await categoryMutationResolver.Mutation.changeCategory(null, args, context);

        expect(result?.name).toBe(updatedCategory.name);

        const fetchedUpdatedCategory = await CategoryService.getBySection(section.name);
        expect(fetchedUpdatedCategory?.[0].name).toBe(updatedCategory.name);
    });

    it('should delete the category', async () => {
        const section = await createTestSection(context);

        const category = await createTestCategory(context, section);

        const args = { _id: category._id.toString() };
        await categoryMutationResolver.Mutation.deleteCategory(null, args, context);

        const deletedCategory = await CategoryService.getBySection(section.name);
        expect(deletedCategory).toHaveLength(0);
    });
});


