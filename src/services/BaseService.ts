import { Document, Model } from 'mongoose';
import { GraphQLError } from 'graphql';
import { IBaseServiceOptions } from '../interfaces/baseServiceTypes';

class BaseService<T extends Document> {
    model: Model<T>;

    constructor({ model }: IBaseServiceOptions<T>) {
        this.model = model;
    }

    private getContentType(): string {

        return this.model.modelName || 'Object';
    }

    public async getAll(): Promise<T[]> {
        try {

            return await this.model.find();
        } catch (error) {
            throw new GraphQLError(`Failed to fetch ${this.getContentType().toLowerCase()}s`);
        }
    }

    public async getByID(id: string): Promise<T | null> {
        try {

            return await this.model.findById(id);
        } catch (error) {
            throw new GraphQLError(`Failed to fetch ${this.getContentType()} by ID`);
        }
    }

    public async createObject(data: Partial<T>): Promise<any> {
        try {

            return await this.model.create(data);
        } catch (error) {
            console.error('Error:', error);
            throw new GraphQLError(`Failed to create ${this.getContentType()}`);
        }
    }

    public async updateByID(id: string, updateData: Partial<T>): Promise<T | null> {
        try {

            return await this.model.findByIdAndUpdate(id, updateData, {
                new: true,
            });
        } catch (error) {
            throw new GraphQLError(`Failed to update ${this.getContentType()} by ID`);
        }
    }

    public async deleteByID(id: string): Promise<T | null> {
        try {

            return await this.model.findByIdAndDelete(id);
        } catch (error) {
            throw new GraphQLError(`Failed to delete ${this.getContentType()} by ID`);
        }
    }
}

export default BaseService;
