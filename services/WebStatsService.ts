import userService from "./UserService";
import { UserRole } from "../constants/UserRole";
import productService from "./ProductService";
import { PERCENT_DAYS } from "../constants/other";
import purchaseProductService from "./PurchaseProductService";
import {permissionCheck} from "../utils/permissionCheck";

class WebStatsService {

    async getWebSiteStatistic(token: string) {
        await permissionCheck(token, UserRole.ADMIN);

        const buyersStatistic = await userService.getUserPercentStats(PERCENT_DAYS, UserRole.BUYER);
        const sellersStatistic = await userService.getUserPercentStats(PERCENT_DAYS, UserRole.SELLER);
        const productsStatistic = await productService.getProductsStats(PERCENT_DAYS);
        const sellsStatistic = await purchaseProductService.getSellsStats();

        return {
            buyers: buyersStatistic,
            sellers: sellersStatistic,
            offers: productsStatistic,
            sells: sellsStatistic
        }
    }
}

export default new WebStatsService();
