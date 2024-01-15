export const reportTypeDefs = `
type Report {
    id: ID!
    reporterId: UserDetail
    suspectId: UserDetail
    targetType: TargetType!
    reportText: String!
    imageUrl: String
    isReviewed: Boolean!
    answerReporterText: String
    answerSuspectText: String

    createdAt: Date
    updatedAt: Date
}

enum TargetType {
    user
    website
}

input sendUserReportInput {
    suspectId: ID!
    reportText: String!
    imageUrl: String
}

input sendWebSiteReportInput {
    reportText: String!
    imageUrl: String
}

input sendAnswerWebsiteReportInput {
    reportId: String!
    answerReporterText: String!
}

input sendAnswerUserReportInput {
    reportId: String!
    answerReporterText: String!
    answerSuspectText: String!
    isBanSuspect: Boolean!
}

input changeReportStatusInput {
    reportId: String!
    status: Boolean
}

type Mutation {
    sendUserReport(input: sendUserReportInput): String
    sendWebsiteReport(input: sendWebSiteReportInput): String
    answerWebsiteReport(input: sendAnswerWebsiteReportInput): String
    answerUserReport(input: sendAnswerUserReportInput): String

    changeReportStatus(input: changeReportStatusInput): String
}

type Query {
    getAllWebsiteReports(isReviewed: Boolean): [Report]
    getAllUserReports(isReviewed: Boolean): [Report]
    openOneReport(reportId: String): Report
}    
`;