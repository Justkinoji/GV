import { clearDatabase, closeDatabase, connect } from '../../config/jest.mongo.setup';
import sectionMutationResolver from '../resolvers/section/sectionMutationResolver';
import SectionService from "../services/SectionService";
import { createTestAdmin, createTestSection } from "./testDataHelpers";
import { ContextType } from "./typesForTests";

let context: ContextType;

beforeAll(async () => await connect());

beforeEach(async () => {

    context = { token: await createTestAdmin() };
});

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe('Sections Mutation Resolvers', () => {
    it('should create a new section', async () => {
        const section = await createTestSection(context);

        expect(section.name).toBe('Test Section');
        expect(section.description).toBe('This is a test section');

        const fetchedSection = await SectionService.getSectionByName(section.name);
        expect(fetchedSection).not.toBeNull();
    });

    it('should update the section', async () => {
        const section = await createTestSection(context);

        const updatedSection = {
            _id: section._id.toString(),
            name: 'Updated Section',
            description: 'This is an updated test section',
            imageUrl: 'https://updatedimage.com',
            filters: {
                inputFields: [{ placeholder: "Updated Field", field: "updatedField" }],
                selects: [],
                minMax: []
            }
        };

        const args = { _id: section._id, input: updatedSection };
        const result = await sectionMutationResolver.Mutation.changeSection(null, args, context);

        expect(result?.name).toBe(updatedSection.name);
        expect(result?.description).toBe(updatedSection.description);

        const fetchedUpdatedSection = await SectionService.getSectionByName(updatedSection.name);
        expect(fetchedUpdatedSection?.name).toBe(updatedSection.name);
    });

    it('should delete the section', async () => {
        const section = await createTestSection(context);

        const args = { _id: section._id.toString() };
        await sectionMutationResolver.Mutation.deleteSection(null, args, context);

        const deletedSection = await SectionService.getSectionByName(section.name);
        expect(deletedSection).toBeNull();
    });
});
