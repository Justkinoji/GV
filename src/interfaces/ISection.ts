import { Types , Document } from "mongoose";
import { IProduct } from "./IProduct";

interface InputField {
    placeholder: string;
    field: string;
}

interface CategoryMin {
    name: string;
    _id: Types.ObjectId;
    products: Types.ObjectId[]
}

interface Select {
    placeholder: string;
    values: string[];
    field: string;
}

interface MinMax {
    field: string;
}

export interface ISection extends Document {
    _id: Types.ObjectId;
    name: string;
    description: string;
    imageUrl: string;
    logoUrl: string;
    categories: CategoryMin[];
    createdBy: Types.ObjectId;
    filters: {
        inputFields: InputField[];
        selects: Select[];
        minMax: MinMax[];
    }
}