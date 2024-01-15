interface sendUserReportInput {
    suspectId: string;
    reportText: string;
    imageUrl?: string;
}

interface sendWebSiteReportInput {
    reportText: string;
    imageUrl?: string;
}

interface sendAnswerWebsiteReportInput {
    reportId: string;
    answerReporterText: string;
}

interface sendAnswerUserReportInput {
    reportId: string;
    answerReporterText: string;
    answerSuspectText: string;
    isBanSuspect: boolean;
}

interface changeReportStatusInput {
    reportId: string;
    status: boolean;
}

export { sendUserReportInput, sendAnswerWebsiteReportInput, sendAnswerUserReportInput, sendWebSiteReportInput, changeReportStatusInput };