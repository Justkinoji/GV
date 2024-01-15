import { closeDatabase } from './jest.mongo.setup';

export default async function globalTeardown() {
    await closeDatabase();
}
