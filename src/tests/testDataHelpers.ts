import sectionMutationResolver from "../resolvers/section/sectionMutationResolver";
import { UserRole } from "../constants/UserRole";
import UserService from "../services/UserService";
import categoryMutationResolver from "../resolvers/category/categoryMutationResolver";
import { ContextType } from "./typesForTests";
import { ISection } from "../interfaces/ISection";
import {Platform} from "../constants/Platform";
import productMutationResolver from "../resolvers/products/productMutationResolver";
import {ICategory} from "../interfaces/ICategory";

export async function createTestAdmin() {
    const newUser = {
        email: 'admin@gmail.com',
        password: 'AdminPassword123',
        role: UserRole.ADMIN
    };

    const adminUser = await UserService.createObject(newUser);

    return adminUser.token;
}

export async function createTestSeller() {
    const newUser = {
        email: 'seller@gmail.com',
        password: 'SellerPassword123',
        role: UserRole.SELLER
    };

    const user = await UserService.createObject(newUser);

    return user.token;
}

export async function createTestBuyer() {
    const newUser = {
        email: 'buyer@gmail.com',
        password: 'BuyerPassword123',
        role: UserRole.BUYER
    };

    const user = await UserService.createObject(newUser);

    return user.token;
}

export async function createTestSection(context: ContextType) {
   const inputSection = {
        name: 'Test Section',
        description: 'This is a test section',
        imageUrl: 'https://testimage.com',
        filters: {
            inputFields: [{ placeholder: "Field Placeholder", field: "field1" }],
            selects: [],
            minMax: []
        }
   };

   const args = { input: inputSection };

   return await sectionMutationResolver.Mutation.createSection(null, args, context);
}

export async function createTestCategory(context: ContextType, section: ISection) {
    const inputCategory = {
        categoryName: 'Test Category',
        sectionName: section.name,
        description: 'some description'
    };

    const args = { input: inputCategory };

    return await categoryMutationResolver.Mutation.createCategory(null, args, context);
}

export async function createTestProduct(context: ContextType, section: ISection, category: ICategory) {
    const inputProduct = {
        price: 100,
        imageUrl: 'https://testimage.com',
        categoryId: category._id.toString(),
        sectionId: section._id.toString(),
        description: {
            en: 'some description',
            sh: 'some description',
            pt: 'some description',
            ar: 'some description',
            ru: 'some description',
            es: 'some description'
        },
        shortDescription: {
            en: 'some description',
            sh: 'some description',
            pt: 'some description',
            ar: 'some description',
            ru: 'some description',
            es: 'some description'
        },
        platform: Platform.XBOX,
        sold: false,
        quantity: 10
    };

    return await productMutationResolver.Mutation.createProduct(null, {input: inputProduct}, context);
}
