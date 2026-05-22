export interface DashboardSummaryStaffDto {
    draftCount: number;
    returnedForRevisionCount: number;
    internalReviewCount: number;
    appraisalCount: number;
    signingCount: number;
    issuedCount: number;
}

export interface DashboardSummaryManagerDto {
    internalSigningCount: number;
    pendingReviewCount: number;
    needConfirmationCount: number;
    rejectedCount: number;
}