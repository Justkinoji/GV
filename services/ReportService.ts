import Report from '../models/Report';
import BaseService from "./BaseService";
import { authService } from "./AuthService";
import userService from "./UserService";
import { UserNotFoundError } from "../errors/userErrors";
import { toObjectId, validateReportText, sendReportAnswerEmail, isAdminOrModerator } from "../utils/_index";
import { IReport } from "../interfaces/IReport";
import {
    changeReportStatusInput,
    sendAnswerUserReportInput,
    sendAnswerWebsiteReportInput,
    sendUserReportInput,
    sendWebSiteReportInput
} from "../inputs/reportInterfaces";
import { TargetTypes } from "../constants/TargetTypes";

class ReportService extends BaseService<IReport> {
        constructor() {
            super({ model: Report });
        }

        async sendUserReport(data: sendUserReportInput, token: string): Promise<String> {

            return this._sendReport(data, TargetTypes.USER, token);
        }

        async sendWebsiteReport(data: sendWebSiteReportInput, token: string): Promise<String> {

            return this._sendReport( data, TargetTypes.WEBSITE, token);
        }

        async answerWebsiteReport(data: sendAnswerWebsiteReportInput, token: string): Promise<String> {
            if(!await isAdminOrModerator(token)) throw new Error("You are not an admin or moderator");

            const { reportId, answerReporterText } = data;
            const report = await super.getByID(reportId);

            if(!report) throw new Error("Report not found");

            const response = this.sendAnswerEmail(report.reporterId.toString(), answerReporterText)
            report.answerReporterText = answerReporterText;
            report.isReviewed = true;

            await report.save();

            return response;
        }

        async answerUserReport(data: sendAnswerUserReportInput, token: string): Promise<String> {
            if(!await isAdminOrModerator(token)) throw new Error("You are not an admin or moderator");

            const { reportId, answerReporterText, answerSuspectText, isBanSuspect } = data;
            const report = await super.getByID(reportId);

            if(!report) throw new Error("Report not found");

            const { reporterId, suspectId } = report;

            if(!suspectId) {
                throw new Error("Suspected user not found");
            }

            const messageToReporter = await this.sendAnswerEmail(reporterId.toString(), answerReporterText);
            const messageToSuspect = await this.sendAnswerEmail(suspectId.toString(), answerSuspectText);

            if(isBanSuspect) {
                const user = await userService.findUserById(suspectId.toString());

                if (!user) throw UserNotFoundError(suspectId.toString());

                if ("banned" in user) {
                    user.banned = true;
                    await user.save();
                }
            }

            report.answerReporterText = answerReporterText;
            report.answerSuspectText = answerSuspectText;
            report.isReviewed = true;

            await report.save();

            const response = `For reported user with ID ${reporterId} ${messageToReporter}. 
            For suspected user with ID ${suspectId} ${messageToSuspect}`;

            const banResponse = ` Suspected user was banned`;

            return isBanSuspect? `${response}${banResponse}` : response;
        }

        async changeReportStatus(data: changeReportStatusInput, token: string): Promise<String> {
            if(!await isAdminOrModerator(token)) throw new Error("You are not an admin or moderator");

            const { reportId, status } = data;
            const report = await super.getByID(reportId);

            if(!report) throw new Error("Report not found");

            report.isReviewed = status;

            await report.save();

            const banResponse = ` Suspected user was banned`;

            return `Report with id ${reportId}, now have status ${status}`
        }

        async getAllReports(isReviewed: boolean, targetType: TargetTypes, token: string): Promise<IReport[]> {
            if(!await isAdminOrModerator(token)) throw new Error("You are not an admin or moderator");

            let reports: IReport[];

            if (isReviewed) {
                reports = await Report.find({ isReviewed: true, targetType: targetType }).populate(["reporterId", "suspectId"]) as IReport[];
            } else {
                reports = await Report.find({ isReviewed: false, targetType: targetType }).populate(["reporterId", "suspectId"]) as IReport[];
            }

            return reports;
        }

        async getReportById(id: string, token: string): Promise<IReport | null> {
            authService.checkToken(token);

            return super.getByID(id);
        }

        private async _sendReport(data: { suspectId?: string, reportText: string, imageUrl?: string },
                                  targetType: TargetTypes,
                                  token: string): Promise<String> {
            const { id: reporterId } = await authService.verifyTokenAndGetData(token);
            const { suspectId, reportText, imageUrl } = data;

            if (targetType === TargetTypes.USER && suspectId) {
                const existingUser = await userService.findUserById(suspectId);
                if (!existingUser) {
                    throw UserNotFoundError(suspectId);
                }
            }

            const reportData: Partial<IReport> = {
                reporterId: toObjectId(reporterId),
                targetType,
                reportText,
                imageUrl,
                suspectId: suspectId ? toObjectId(suspectId) : undefined
            };

            await validateReportText({ reportText });
            await super.createObject(reportData);

            return "Report successfully sent.";
        }

        private async sendAnswerEmail(userId: string, answerText: string): Promise<String> {
            const user = await userService.findUserById(userId);

            if(!user) throw UserNotFoundError(userId);

            return sendReportAnswerEmail(user.email, answerText);
        }
}

export default new ReportService();
