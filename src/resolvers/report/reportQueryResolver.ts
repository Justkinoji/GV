import ReportService from "../../services/ReportService";
import { TargetTypes } from "../../constants/TargetTypes";

const reportQueryResolver = {
    Query: {
        getAllWebsiteReports: async (_: any, { isReviewed }: { isReviewed: boolean }, context: any) => {
            try {

                return await ReportService.getAllReports(isReviewed, TargetTypes.WEBSITE, context.token);
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        },

        getAllUserReports: async (_: any, { isReviewed }: { isReviewed: boolean }, context: any) => {
            try {

                return await ReportService.getAllReports(isReviewed, TargetTypes.USER, context.token);
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        },

        openOneReport: async (_: any, { reportId }: { reportId: string }, context: any) => {
            try {

                return await ReportService.getReportById(reportId, context.token);
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }
    }
}

export default reportQueryResolver;
