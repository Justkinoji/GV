import { clearDatabase, closeDatabase, connect } from '../../config/jest.mongo.setup';
import { createTestAdmin, createTestBuyer, createTestSeller } from "./testDataHelpers";
import reportMutationResolver from "../resolvers/report/reportMutationResolver";
import ReportService from "../services/ReportService";
import { TargetTypes } from "../constants/TargetTypes";
import UserService from "../services/UserService";
import { ContextType } from "./typesForTests";

let adminContext: ContextType;
let user1Context: any;
let user2Context: any;

beforeAll(async () => await connect());

beforeEach(async () => {
    adminContext = { token: await createTestAdmin() };
    user1Context = { token: await createTestSeller() };
    user2Context = { token: await createTestBuyer() };
});

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe('Report Mutation Resolvers', () => {

    it('should send a user report', async () => {
        const args = {
            input: {
                suspectId: user1Context.id,
                reportText: 'Suspicious behavior by user2',
                imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            }
        };
        const result = await reportMutationResolver.Mutation.sendUserReport(null, args, user1Context);

        expect(result).toBe("Report successfully sent.");
    });

    it('should send a website report', async () => {
        const args = {
            input: {
                reportText: 'Website issue found',
                imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            }
        };
        const result = await reportMutationResolver.Mutation.sendWebsiteReport(null, args, user1Context);

        expect(result).toBe("Report successfully sent.");
    });

    it('should answer a website report', async () => {
        const input = {
            reportText: 'Website issue found',
                imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }

        await ReportService.sendWebsiteReport(input, user1Context.token);
        const reports = await ReportService.getAllReports(false, TargetTypes.WEBSITE, adminContext.token);

        expect(reports.length).toBeGreaterThan(0);

        const args = {
            input: {
                reportId: reports[0].id,
                answerReporterText: 'Issue resolved'
            }
        };
        const result = await reportMutationResolver.Mutation.answerWebsiteReport(null, args, adminContext);

        expect(result).toMatch(/Email to .+? has been sent successfully\./);
    });

    it('should answer a user report and ban the user', async () => {

        const suspectedUser = await UserService.findUserByEmail("buyer@gmail.com");

        expect(suspectedUser).not.toBeNull();

        await ReportService.sendUserReport({
            suspectId: suspectedUser?.id,
            reportText: 'Suspicious behavior by user2' },
            user1Context.token);
        const reports = await ReportService.getAllReports(false, TargetTypes.USER, adminContext.token);

        expect(reports.length).toBeGreaterThan(0);

        const args = {
            input: {
                reportId: reports[0].id,
                answerReporterText: 'Thank you for the report',
                answerSuspectText: 'You have been reported',
                isBanSuspect: true
            }
        };
        const result = await reportMutationResolver.Mutation.answerUserReport(null, args, adminContext);

        expect(result).toMatch(/For reported user/);
        expect(result).toMatch(/Suspected user was banned/);
    });
});

