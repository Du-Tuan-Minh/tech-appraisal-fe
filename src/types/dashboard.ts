export interface DashboardSummaryStaffDto {
    draftCount: number;
    returnedForRevisionCount: number;
    internalReviewCount: number;
    appraisalCount: number;
    signingCount: number;
    issuedCount: number;
}

////////////////
// export interface AppraisalDashboardDto {
//     totalDocuments: number;
//     documentsUnderAppraisal: number;
//     approvedDocuments: number;
//     rejectedDocuments: number;
//     openIssues: number;
//     viewScope: string;
//     lastUpdated: string;
// }