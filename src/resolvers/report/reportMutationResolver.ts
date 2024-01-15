import { authService } from "../../services/AuthService";
import {
    changeReportStatusInput,
    sendAnswerUserReportInput,
    sendAnswerWebsiteReportInput,
    sendUserReportInput, sendWebSiteReportInput
} from "../../inputs/reportInterfaces";
import ReportService from "../../services/ReportService";

const reportMutationResolver = {
    Mutation: {
        async sendUserReport(_: any, { input }: { input: sendUserReportInput }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await ReportService.sendUserReport(input, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong sending the report. Please try again.');
            }
        },

        async sendWebsiteReport(_: any, { input }: { input: sendWebSiteReportInput; }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await ReportService.sendWebsiteReport(input, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong sending the report. Please try again.');
            }
        },

        async answerWebsiteReport(_: any, { input }: { input: sendAnswerWebsiteReportInput; }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await ReportService.answerWebsiteReport(input, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong sending the report`s answer. Please try again.');
            }
        },

        async answerUserReport(_: any, { input }: { input: sendAnswerUserReportInput; }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await ReportService.answerUserReport(input, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong sending the report`s answer. Please try again.');
            }
        },

        async changeReportStatus(_: any, { input }: { input: changeReportStatusInput; }, context: any) {
            const token = authService.checkToken(context.token);

            try {

                return await ReportService.changeReportStatus(input, token);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Something went wrong sending the report`s answer. Please try again.');
            }
        }
    }
}

export default reportMutationResolver;