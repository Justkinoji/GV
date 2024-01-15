import BaseService from "./BaseService";
import SectionService from "./SectionService";
import Category from "../models/Category";
import Product from "../models/Product";
import { UserRole } from "../constants/UserRole";
import { permissionCheck } from "../utils/permissionCheck";
import { filterProducts } from "../utils/filterProducts";
import { ICategory } from "../interfaces/ICategory";
import { CategoryInput, CategoryUpdateInput, GetOneCategoryInput } from "../inputs/sectionAndCategoryTypes";
import { ISection } from "../interfaces/ISection";
import { IPopulatedCategory, IPopulatedCategoryWithProducts } from "../inputs/categoryTypes";
import { GetAllWithFilters } from "../inputs/userTypes";

import { IProduct } from "../interfaces/IProduct";

class CategoryService extends BaseService<ICategory> {
    constructor() {
        super({model: Category});
    }

    async getByIdWithProducts(data: GetOneCategoryInput): Promise<IPopulatedCategoryWithProducts | null> {
        try {
            const { id, productsPerPage, page } = data;

            const rawCategory = await this.model.findById(id)
                .populate({
                    path: 'sectionId',
                    select: '_id'
                })
                .exec() as any;

            if(!rawCategory) {
                return null;
            }

            let products: IProduct[] = [];

            if (page && productsPerPage) {
                const skipProducts = (page - 1) * productsPerPage;
                products = await Product.find({ categoryId: id })
                    .sort({ createdAt: -1 })
                    .skip(skipProducts)
                    .limit(productsPerPage)
                    .populate({
                        path: 'createdBy',
                        select: 'userName avatarURL level confidentLvl experience _id lastActivity'
                    })
                    .exec() as IProduct[];
            } else {
                products = await Product.find({ categoryId: id })
                    .sort({ createdAt: -1 })
                    .populate({
                        path: 'createdBy',
                        select: 'userName avatarURL level confidentLvl experience _id lastActivity'
                    })
                    .exec() as IProduct[];
            }

            let filteredProducts;

            if (data.filter) {
                filteredProducts = filterProducts(products, data.filter);
            } else {
                filteredProducts = products;
            }

            return {
                _id: rawCategory._id,
                name: rawCategory.name,
                fee: rawCategory.fee,
                sectionId: rawCategory.sectionId._id.toString(),
                products: filteredProducts as any
            };

        } catch (error) {
            console.error('Error:', error);
            throw new Error('Failed to get category by ID.');
        }
    }

    async createCategory(data: CategoryInput, token: string): Promise<ICategory> {
        await permissionCheck(token, UserRole.ADMIN);

        const { categoryName, sectionName, fee } = data;

        const section: ISection | null = await SectionService.getSectionByName(sectionName);

        if (!section) {
            throw new Error('Section not found');
        }

        const category =  await super.createObject(
            {
                name: categoryName,
                sectionId: section._id,
                fee
            } as Partial<ICategory>);

        if (!section.categories) {
            section.categories = [];
        }

        section.categories.push(category._id);
        await section.save();

        return category;
    }

    async changeCategory(data: CategoryUpdateInput, token: string): Promise<ICategory | null> {
        await permissionCheck(token, UserRole.ADMIN);

        const { _id, name, fee } = data;

        return await super.updateByID(_id, { name, fee } as Partial<ICategory>);
    }

    async deleteCategory(_id: string, token: string): Promise<String | null> {
        await permissionCheck(token, UserRole.ADMIN);

        await super.deleteByID(_id);

        return `Category ${_id} successfully deleted`;
    }

    async getBySection(sectionName: string): Promise<ICategory[] | null> {

        const section: ISection | null = await SectionService.getSectionByName(sectionName);

        if (!section) {
            throw new Error('Section not found');
        }

        return this.model.find({sectionId: section._id});
    }

    async getAllCategories(): Promise<IPopulatedCategory[] | null> {
        try {

            const categories = await this.model.find().populate({
                path: 'sectionId',
                select: 'name _id'
            }).exec();

            console.log('categories', categories);

            const t = categories.map(category => {
                const section = category.sectionId as any;
                return {
                    ...category.toObject(),
                    section: {
                        _id: section._id,
                        name: section.name
                    },
                    sectionId: undefined
                };
            });

            console.log('t', t);

            return t;

        } catch (error) {
            console.error('Error:', error);
            throw new Error('Failed to get categories.');
        }
    }

    async getAllCategoriesAdmin(data: GetAllWithFilters, token: string): Promise<IPopulatedCategory[] | null> {
        await permissionCheck(token, UserRole.ADMIN);

        const { name, signupDate } = data;
        const filter: any = {};

        if (name) {
            filter["name"] = { $regex: new RegExp(name, 'i') };
        }

        if (!(signupDate) || signupDate.from && signupDate.to) {
            filter["createdAt"] = { $gte: signupDate?.from, $lte: signupDate?.to };
        }

      const categories = await this.model.find(filter).populate({
            path: 'sectionId',
            select: 'name _id'
        }) as ICategory[];

        return categories.map(category => {
            const section = category.sectionId as any;
            return {
                ...category.toObject(),
                section: {
                    _id: section._id,
                    name: section.name
                },
                sectionId: undefined
            };
        });
    }
}

export default new CategoryService
