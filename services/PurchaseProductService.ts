import mongoose from "mongoose";
import BaseService from "./BaseService";
import PurchaseProduct from "../models/PurchaseProduct";
import UserService from "./UserService";
import Product from "../models/Product";
import { toPurchaseProductDetails } from "../utils/_index";
import { validatePurchaseProductInput } from "../utils/validation/purchaseProductValidation";
import { toUserDTO, toUserDTOTsIgnore } from "../utils/toUserDTO";
import { UserRole } from "../constants/UserRole";
import { IPurchaseProduct } from "../interfaces/IPurchaseProduct";
import {
    AggregatedResult,
    getTopSellersOrBuyersInput,
    PurchaseProductDetails,
    PurchaseProductInput,
    SellerSendDetailsInput
} from "../inputs/purchaseProductTypes";
import { UserDTO } from "../interfaces/UserDTO";
import { permissionCheck } from "../utils/_index";


class PurchaseProductService extends BaseService<IPurchaseProduct> {
    constructor() {
        super({ model: PurchaseProduct });
    }

    async createPurchaseProduct(data: PurchaseProductInput, token: string): Promise<PurchaseProductDetails> {
        await validatePurchaseProductInput(data);

        const currentUser = await UserService.getUserByToken(token);
        const { productId, soldBy, payment, status, received, acceptedAt, price } = data;

        const purchaseProduct = {
            productId: new mongoose.Types.ObjectId(productId),
            boughtBy: new mongoose.Types.ObjectId(currentUser.id),
            soldBy: new mongoose.Types.ObjectId(soldBy),
            payment,
            status,
            received,
            acceptedAt,
            price
        };

        const createdObject = await this.createObject(purchaseProduct);

        return this.getOnePurchaseProduct(createdObject._id);
    }

    async updatePurchaseProduct(data: PurchaseProductInput, token: string): Promise<PurchaseProductDetails> {
        await validatePurchaseProductInput(data);

        const currentUser = await UserService.getUserByToken(token);
        const { id, productId, soldBy, payment, status, received, acceptedAt, price } = data;

        if (id == null) {
            throw new Error("Id is required.");
        }

        const purchaseProduct = await this.getByID(id);

        if (!purchaseProduct) {
            throw new Error("PurchaseProduct not found.");
        }

        if (purchaseProduct.boughtBy.toString() !== currentUser.id.toString()) {
            throw new Error("You are not the buyer of this product.");
        }

        const updatedPurchaseProduct = {
            productId: new mongoose.Types.ObjectId(productId),
            boughtBy: new mongoose.Types.ObjectId(currentUser.id),
            soldBy: new mongoose.Types.ObjectId(soldBy),
            payment,
            status,
            received,
            acceptedAt,
            price
        };

        await this.updateByID(id, updatedPurchaseProduct);

        return this.getOnePurchaseProduct(id);
    }

    async sellerSendDetails(data: SellerSendDetailsInput, token: string): Promise<PurchaseProductDetails> {
        const { purchaseProductId, sellerSentAt } = data;

        const currentUser = await UserService.getUserByToken(token);
        const purchaseProduct = await this.getByID(purchaseProductId);

        if (!purchaseProduct) {
            throw new Error("PurchaseProduct not found.");
        }

        if (purchaseProduct.soldBy.toString() !== currentUser.id.toString()) {
            throw new Error("You are not the seller of this product.");
        }

        await this.updateByID(purchaseProductId, { sellerSentAt });

        return this.getOnePurchaseProduct(purchaseProductId);
    }

    async getMyBoughtProducts(token: string): Promise<PurchaseProductDetails[]> {
        const currentUser = await UserService.getUserByToken(token);

        const boughtProducts = await this.model.find({ boughtBy: currentUser.id })
            .populate({
                path: 'productId',
                model: 'Product',
                select: ['_id', 'shortDescription']
            })
            .populate({
                path: 'boughtBy',
                select: ['_id', 'userName', 'avatarURL', 'email', 'lastActivity'],
                model: 'User'
            })
            .populate({
                path: 'soldBy',
                select: ['_id', 'userName', 'avatarURL', 'email', 'lastActivity'],
                model: 'User'
            }) as any;

        return boughtProducts.map(toPurchaseProductDetails);
    }

    async getMySoldProducts(token: string): Promise<PurchaseProductDetails[]> {
        const currentUser = await UserService.getUserByToken(token);

        const boughtProducts = await this.model.find({ soldBy: currentUser.id })
            .populate({
                path: 'productId',
                model: 'Product',
                select: ['_id', 'shortDescription']
            })
            .populate({
                path: 'boughtBy',
                select: ['_id', 'userName', 'avatarURL'],
                model: 'User'
            })
            .populate({
                path: 'soldBy',
                select: ['_id', 'userName', 'avatarURL'],
                model: 'User'
            }) as any;

        return boughtProducts.map(toPurchaseProductDetails);
    }

    async getOnePurchaseProduct(id: string): Promise<PurchaseProductDetails> {
        const purchaseProduct = await this.model.findById(id)
            .populate({
                path: 'productId',
                model: 'Product',
                select: ['_id', 'shortDescription']
            })
            .populate({
                path: 'boughtBy',
                model: 'User'
            })
            .populate({
                path: 'soldBy',
                model: 'User'
            }) as any;

        return toPurchaseProductDetails(purchaseProduct);
    }

    async getAllUsersPurchases(): Promise<PurchaseProductDetails[]> {
        const boughtProducts = await this.model.find()
            .populate({
                path: 'productId',
                model: 'Product',
                select: ['_id', 'shortDescription']
            })
            .populate({
                path: 'boughtBy',
                select: ['_id', 'userName', 'avatarURL'],
                model: 'User'
            })
            .populate({
                path: 'soldBy',
                select: ['_id', 'userName', 'avatarURL'],
                model: 'User'
            }) as any;
            console.log(boughtProducts)
        return boughtProducts;
    }

    async getTopSellers(data: getTopSellersOrBuyersInput): Promise<UserDTO[]> {

        return await this.aggregateTopUsers(UserRole.SELLER, data);
    }

    async getTopBuyers (data: getTopSellersOrBuyersInput): Promise<UserDTO[]> {

        return await this.aggregateTopUsers(UserRole.BUYER, data);
    }

    async getUserPurchases(userId: string): Promise<PurchaseProductDetails[]> {
        const userPurchases = await this.model.find({ boughtBy: userId })
            .populate({
                path: 'productId',
                model: 'Product',
                select: ['_id', 'shortDescription']
            })
            .populate({
                path: 'boughtBy',
                select: ['_id', 'userName', 'avatarURL'],
                model: 'User'
            })
            .populate({
                path: 'soldBy',
                select: ['_id', 'userName', 'avatarURL'],
                model: 'User'
            }) as any;

        return userPurchases.map(toPurchaseProductDetails);
    }

    async getAllPurchases(token: string): Promise<PurchaseProductDetails[]> {
        const user = await permissionCheck(token, UserRole.ADMIN)
        if (!user){
            throw new Error("You don't have permissions")
        }
        const userPurchases = await this.model.find()
            .populate({
                path: 'productId',
                model: 'Product',
                strictPopulate: false,
                select: ['_id', 'shortDescription']
            })
            .populate({
                path: 'boughtBy',
                select: ['_id', 'userName', 'avatarURL'],
                model: 'User'
            })
            .populate({
                path: 'soldBy',
                select: ['_id', 'userName', 'avatarURL'],
                model: 'User'
            }) as any;

        return userPurchases.map(toPurchaseProductDetails);
    }

    async getSellsStats() {
        const salesStats = await PurchaseProduct.aggregate([
            {
                $match: { acceptedAt: { $exists: true } }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: '$product.sectionId',
                    total: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'sections',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'section'
                }
            },
            { $unwind: '$section' },
            {
                $project: {
                    _id: 0,
                    name: '$section.name',
                    total: 1
                }
            },
            { $sort: { total: -1 } }
        ]).exec();

        return salesStats.filter(stat => stat.total > 0).map(stat => ({
            name: stat.name,
            total: stat.total
        }));
    }


    private async aggregateTopUsers(role: UserRole, data: getTopSellersOrBuyersInput): Promise<UserDTO[]> {
        const aggregationField = role === UserRole.SELLER ? "$soldBy" : "$boughtBy";
        const { page, limit } = data;
    
        const skipCount = (page - 1) * limit;
    
        const results = await PurchaseProduct.aggregate([
            { $group: { _id: aggregationField, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $skip: skipCount },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" }
        ]) as any;
    
        return results.map((result: any) => {
            let userDto = toUserDTOTsIgnore(result.user);
            userDto.soldORBoughtProducts = result.count; // Add the transaction count to the UserDTO
            return userDto;
        });
    }
    
}

export default new PurchaseProductService();
