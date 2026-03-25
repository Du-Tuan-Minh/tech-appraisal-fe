export interface AppraisalDashboardDto {
    totalDocuments: number;
    documentsUnderAppraisal: number;
    approvedDocuments: number;
    rejectedDocuments: number;
    openIssues: number;
    viewScope: string;
    lastUpdated: string;
}