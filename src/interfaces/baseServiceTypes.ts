import { Document, Model } from 'mongoose';

interface IBaseServiceOptions<T extends Document> {
    model: Model<T>;
}

export { IBaseServiceOptions };
