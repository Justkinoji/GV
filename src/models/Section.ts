import mongoose, { Schema } from "mongoose";
import { ISection } from "../interfaces/ISection";

const sectionSchema: Schema = new Schema<ISection>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    imageUrl: {
        type: String,
    },
    logoUrl: {
        type: String,
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filters: {
        inputFields: [{
            placeholder: {
                type: String
            },
            field: {
                type: String
            }
        }],
        selects: [{
            placeholder: {
                type: String
            },
            values: [{
                type: String
            }],
            field: {
                type: String
            }
        }],
        minMax: [{
            field: {
                type: String
            }
        }]
    }
},{
    timestamps: true,
    versionKey: false,
    collection: 'sections',
})

const Section = mongoose.model<ISection, mongoose.Model<ISection>>("Section", sectionSchema);
export default Section;