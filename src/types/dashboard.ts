export interface DashboardSummaryStaffDto {
    draftCount: number;
    returnedForRevisionCount: number;
    internalReviewCount: number;
    appraisalCount: number;
    signingCount: number;
    issuedCount: number;
    overdueCount: number;
}

export interface DashboardSummaryManagerDto {
    reviewingDocuments: number;
    needConfirmationCount: number;
    rejectedCount: number;
    overdueReviewDocuments: number;
}

export interface DashboardSummaryDirectorDto {
    draftingCount: number;
    appraisingCount: number;
    signingCount: number;
    issuedCount: number;
    rejectedCount: number;
    overdueSigningCount: number;
}

export interface ManagerWorkloadDto {
    managerId: string;
    managerName: string;
    departmentName: string;
    pendingAssignments: number;
    inReviewAssignments: number;
    overdueAssignments: number;
}

export interface DepartmentDocumentStatusSummaryDto {
    reviewingDocuments: number;
    overdueReviewDocuments: number;
    issuedDocuments: number;
    rejectedDocuments: number;
}

export interface DashboardSummaryCoordinatorDto {
    totalDepartments: number;
    pendingAssignments: number;
}