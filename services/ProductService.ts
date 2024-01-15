import Product from '../models/Product';
import BaseService from './BaseService';
import CategoryService from './CategoryService';
import SectionService from './SectionService';
import stripeInstance from '../../config/stripeConnection';
import {permissionCheck} from '../utils/permissionCheck';
import {toProductDetails, validateProductInput} from '../utils/_index';
import {UserRole} from '../constants/UserRole';
import {PRODUCTS_PER_PAGE} from '../constants/other';
import {IProduct} from '../interfaces/IProduct';
import {ProductCreateInput, ProductDetails, ProductResponse,} from '../inputs/productInterfaces';
import {ICategory} from '../interfaces/ICategory';
import {ISection} from '../interfaces/ISection';

class ProductService extends BaseService<IProduct> {
    constructor() {
        super({ model: Product });
    }

    async createProduct(
        data: ProductCreateInput,
        token: string
    ): Promise<ProductResponse> {
        await validateProductInput(data);
        const seller = await permissionCheck(token, UserRole.SELLER);

        const { category: rawCategory, section } =
            await this.fetchCategoryAndSection(data.categoryId, data.sectionId);
        const category = rawCategory as ICategory;
        const stripePriceId = await this.createStripePrice(
            data.price,
            data.shortDescription.en
        );

        const product = new Product({
            createdBy: seller._id,
            stripePriceId: stripePriceId,
            ...data,
            sold: false,
        });

        const savedProduct = await super.createObject(product);

        if (savedProduct) {
            if (!category.products) {
                category.products = [];
            }
            category.products.push(savedProduct._id);
            await category.save();
        }

        return {
            id: savedProduct._id,
            price: savedProduct.price,
            category: category.name,
            section: section.name,
            ...savedProduct.toObject({ virtuals: true, versionKey: false }),
        };
    }

    async changeProduct(
        data: ProductCreateInput,
        token: string
    ): Promise<ProductResponse> {
        await validateProductInput(data);
        const seller = await permissionCheck(token, UserRole.SELLER);

        const { category, section } = await this.fetchCategoryAndSection(
            data.categoryId,
            data.sectionId
        );

        let existingProduct;
        if (data.id != null) {
            existingProduct = await this.getByID(data.id);
            if (!existingProduct) {
                throw new Error('Product not found');
            }
        }

        if (!existingProduct) {
            throw new Error('Product not found');
        }

        let stripePriceId = existingProduct.stripePriceId;
        if (existingProduct.price !== data.price) {
            stripePriceId = await this.createStripePrice(
                data.price,
                data.shortDescription.en
            );
        }

        const product = new Product({
            createdBy: seller._id,
            stripePriceId: stripePriceId,
            ...data,
        });

        const updatedProduct = await super.updateByID(
            <string>product._id,
            product
        );

        if (!updatedProduct) {
            throw new Error('Failed to update the product');
        }

        return {
            id: updatedProduct?._id,
            price: updatedProduct.price,
            category: category.name,
            section: section.name,
            ...updatedProduct?.toObject({ virtuals: true, versionKey: false }),
        };
    }

    async deleteProduct(id: string, token: string): Promise<String> {
        await permissionCheck(token, UserRole.SELLER);

        await super.deleteByID(id);

        return `Product ${id} has been deleted`;
    }

    async getAllProducts(section: string): Promise<ProductDetails[]> {
        const skipProducts = (Number(section) - 1) * PRODUCTS_PER_PAGE;

        const products = (await Product.find()
            .sort({ createdAt: -1 })
            .skip(skipProducts)
            .limit(PRODUCTS_PER_PAGE)
            .populate({
                path: 'createdBy',
                select: 'userName avatarURL',
            })
            .populate({
                path: 'categoryId',
                select: 'name',
            })
            .populate({
                path: 'sectionId',
                select: 'name',
            })
            .select(
                'id price shortDescription platform createdAt'
            )) as IProduct[];

        return products.map(product => toProductDetails(product));
    }

    async getOneProduct(id: string): Promise<ProductDetails> {
        const product = (await Product.findById(id)
            .populate({
                path: 'createdBy',
                select: 'userName email avatarURL paypalInfo stripeId ratingsStats',
            })
            .populate({
                path: 'categoryId',
                select: 'name',
            })
            .populate({
                path: 'sectionId',
                select: 'name',
            })
            .select(
                'id price imageUrl description shortDescription platform createdAt quantity'
            )) as IProduct;
            
        if (!product) {
            throw new Error('Product not found');
        }

        return toProductDetails(product);
    }

    async getMyOneProduct(id: string, token: string): Promise<ProductDetails> {
        const { id: userId } = await permissionCheck(token, UserRole.SELLER);
        const product = await this.getOneProduct(id);

        const sellerId = product.createdBy.id;

        if (userId.toString() !== sellerId.toString()) {
            throw new Error('You are not authorized to perform this action');
        }

        return product;
    }

    async getMyProducts(token: string): Promise<ProductDetails[]> {
        const { id: userId } = await permissionCheck(token, UserRole.SELLER);
        const products = (await Product.find({ createdBy: userId })
            .populate({
                path: 'createdBy',
                select: 'userName avatarURL email lastActivity',
            })
            .populate({
                path: 'categoryId',
                select: 'name',
            })
            .populate({
                path: 'sectionId',
                select: 'name',
            })
            .select(
                'id price description shortDescription platform createdAt quantity sold '
            )) as IProduct[];

        return products.map(product => toProductDetails(product));
    }

    async getSellerProducts(id: string): Promise<ProductDetails[]> {
        const products = (await Product.find({ createdBy: id })
            .populate({
                path: 'createdBy',
                select: 'userName avatarURL',
            })
            .populate({
                path: 'categoryId',
                select: 'name',
            })
            .populate({
                path: 'sectionId',
                select: 'name',
            })
            ) as IProduct[];

        return products.map(product => toProductDetails(product));
    }

    async getProductsByIds(productIds: string[]): Promise<IProduct[]> {
        return Product.find({ _id: { $in: productIds } });
    }

    async getProductsStats(percentDays: number) {
        try {
            const startDate = new Date(Date.now() - percentDays * 24 * 60 * 60 * 1000);
            const totalUnsoldProducts = await Product.countDocuments({sold: false});

            const unsoldProducts = await Product.countDocuments({
                sold: false,
                createdAt: { $gte: startDate }
            });

            const percent = totalUnsoldProducts > 0 ? Math.round((unsoldProducts / totalUnsoldProducts) * 100) : 0;

            return {
                total: totalUnsoldProducts,
                percent
            };
        } catch (error) {
            throw error;
        }
    }

    private async fetchCategoryAndSection(
        categoryId: string,
        sectionId: string
    ) {
        const [category, section] = await Promise.all([
            (await CategoryService.getByID(categoryId)) as ICategory,
            (await SectionService.getByID(sectionId)) as ISection,
        ]);

        if (!category) throw new Error('Category not found');
        if (!section) throw new Error('Section not found');

        return { category, section };
    }

    private async createStripePrice(
        priceAmount: number,
        description: string
    ): Promise<string> {
        const stripePrice = await stripeInstance.prices.create({
            unit_amount: priceAmount * 100,
            currency: 'usd',
            product_data: {
                name: description,
            },
        });

        return stripePrice.id;
    }
}

export default new ProductService();
