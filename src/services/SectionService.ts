import BaseService from "./BaseService";
import Section from "../models/Section";
import {UserRole} from "../constants/UserRole";
import {permissionCheck} from "../utils/permissionCheck";
import {ISection} from "../interfaces/ISection";
import {Types} from "mongoose";
import {ChangeSectionInput, CreateSectionInput} from "../inputs/sectionAndCategoryTypes";
import Category from "../models/Category";

class SectionService extends BaseService<ISection> {
    constructor() {
        super({model: Section});
    }

    async getOneSection(id: string): Promise<ISection | null> {
        try {

            return await this.model.findById(id)
                .populate({
                    path: 'categories',
                    select: 'name',
                    model: 'Category'
                })
                .exec() as ISection;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Failed to get section by ID.');
        }
    }

    async getByName(name: string): Promise<ISection | null> {
        try {

            return await this.model.findOne({ name: new RegExp('^' + name + '$', 'i') })
                .populate({
                path: 'categories',
                select: 'name',
                model: 'Category'
            })
            .exec() as ISection;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Failed to get section by name.');
        }
    }

    async getAllSections(): Promise<ISection[]> {
        try {
            const sections =  await this.model.find()
                .populate({
                    path: 'categories',
                    model: 'Category',
                })
                .exec() as ISection[];

            return sections
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Failed to get sections.');
        }
    }

    async createSection(data: CreateSectionInput, token: string): Promise<ISection> {
        const admin = await permissionCheck(token, UserRole.ADMIN);

        const { name, description, imageUrl, logoUrl, filters } = data;

        return await super.createObject({
            name,
            description,
            imageUrl,
            logoUrl,
            filters,
            createdBy: new Types.ObjectId(admin._id),
        } as Partial<ISection>);
    }

    async changeSection(data: ChangeSectionInput, token: string): Promise<ISection | null> {
        await permissionCheck(token, UserRole.ADMIN);

        const { _id, name, description, imageUrl, logoUrl, filters } = data;

        return await super.updateByID(_id, {
            name,
            description,
            imageUrl,
            logoUrl,
            filters
        }  as Partial<ISection>);
    }

    async deleteSection(_id: string, token: string): Promise<String | null> {
        await permissionCheck(token, UserRole.ADMIN);

        const categories = await Category.find({ sectionId: _id });
        console.log(categories)
        for (const category of categories) {
            if (category && category._id) {
                await Category.deleteOne({_id: category._id});
            } else {
                console.log(`Invalid category data: ${category}`);
            }
        }
        
        await super.deleteByID(_id);

        return `Section ${_id} successfully deleted`;
    }

    async getSectionByName(name: string): Promise<ISection | null> {

        return this.model.findOne({name: name});
    }
}

export default new SectionService;
