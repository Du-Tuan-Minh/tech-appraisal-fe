import type { IssueSeverity } from "@/constants/enum/IssueSeverity";
import type { DocumentStatus } from "@/constants/enum/DocumentStatus";
import type { DocumentType } from "@/constants/enum/DocumentType";
import type { pagination } from "@/types/pagination";
import type { ReviewerStatus } from "@/constants/enum/ReviewerStatus";
import type { ManagerDashboardDocumentType } from "@/constants/enum/ManagerDashboardDocumentType";
import type { AssignmentStatus } from "@/constants/enum/AssignmentStatus";

export interface TechnicalDocumentResponseDto {
    id: string;
    title: string;
    type: DocumentType;
    priority: IssueSeverity;
    status: DocumentStatus;
    requesterName: string;
    createdAt: string;
    departmentName: string;
    currentAssignmentId?: string | null;
    currentVersionId?: string | null;
    currentReviewerId?: string | null;
}

export interface TechnicalDocumentDetailDto extends TechnicalDocumentResponseDto {
    description?: string | null;
    documentCode: string;
    requesterId: string;
    currentHandlerId?: string | null;
    currentHandlerName?: string | null;
    departmentId: string;
    totalVersions: number;
    qrCode?: string | null;
    externalDepartmentIds?: string[] | null;
    approvalProposerIds?: string[] | null;
}

export interface TechnicalDocumentCreateDto {
    title: string;
    documentCode: string;
    description?: string | null;
    type: DocumentType;
    priority: IssueSeverity;
    externalDepartmentIds?: string[] | null;
    approvalProposerIds?: string[] | null;
    attachmentIds?: string[] | null;
    technicalSpecs: Record<string, any>;
}

export interface TechnicalDocumentUpdateDto {
    title: string;
    description?: string | null;
    type: DocumentType;
    priority: IssueSeverity;
    technicalSpecs?: Record<string, any> | null;
    externalDepartmentIds?: string[] | null;
    approvalProposerIds?: string | null;
}

export interface DocumentFilterDto extends pagination {
    searchTerm?: string | null;
    type?: DocumentType | null;
    departmentId?: string | null;
    status?: DocumentStatus | null;
    fromDate?: string | null;
    toDate?: string | null;
}

export interface UserCurrentDocumentDto {
    id: string;
    versionId: string;
    title: string;
    documentCode: string;
    status: DocumentStatus;
    priority: IssueSeverity;
    currentHandlerId?: string | null;
    currentHandlerName?: string | null;
    deadline?: string | null;
}

export interface UserCurrentDocumentFilterDto extends pagination {
    searchTerm?: string | null;
    priority?: IssueSeverity | null;
    status?: string[] | null;
}

export interface PendingAppraisalResponseDto {
    assignmentId: string;
    reviewerId: string;
    reviewerName: string;
    employeeCode: string;
    documentId: string;
    documentTitle: string;
    documentCode: string;
    status: ReviewerStatus;
    deadline?: string | null;
}

export interface PendingAppraisalFilterDto extends pagination {
    searchTerm?: string | null;
    status?: ReviewerStatus | null;
}

export interface OverdueDocumentDto {
    assignmentId: string;
    reviewerId: string;

    reviewerName: string;
    employeeCode: string;

    documentId: string;
    documentTitle: string;
    documentCode: string;

    status: ReviewerStatus;
    deadline?: string | null;
}

export interface OverdueFilterDto extends pagination {
    searchTerm?: string | null;
    status?: ReviewerStatus | null;
}

export interface ManagerDashboardDocumentDto {
    id: string;
    title: string;
    documentCode: string;
    status: DocumentStatus;
    currentHandlerName?: string | null;
    createdAt: string;
    assignmentId?: string | null;
    reviewerId?: string | null;
    reviewerName?: string | null;
    assignmentStatus?: AssignmentStatus | null;
    deadline?: string | null;
}

export interface ManagerDashboardDocumentFilterDto extends pagination {
    type?: ManagerDashboardDocumentType | null;
    searchTerm?: string | null;
}