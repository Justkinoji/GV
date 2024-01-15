import webStatsService from "../../services/WebStatsService";
import { authService } from "../../services/AuthService";

const webStatsQueryResolver = {
    Query: {
        async getWebSiteStatistic(_: never, __: never, context: any) {
           try {
               const token = authService.checkToken(context.token);

               return webStatsService.getWebSiteStatistic(token);
           } catch (error) {
               throw error;
           }
        },
    }
}

export default webStatsQueryResolver;
