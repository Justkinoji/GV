import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from "mongoose";

const mongod = new MongoMemoryServer();

/**
 * Connect to the in-memory database.
 */
export const connect = async () => {
    await mongod.start();
    const uri = mongod.getUri();

    await mongoose.connect(uri);
}

/**
 * Drop database, close the connection and stop mongod.
 */
export const closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
}

/**
 * Remove all the data for all db collections.
 */
export const clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
}

export default async function globalSetup() {
    await connect();
}

export async function globalTeardown() {
    await closeDatabase();
}
