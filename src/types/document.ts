import type { IssueSeverity } from "@/constants/enum/IssueSeverity";
import type { DocumentStatus } from "@/constants/enum/DocumentStatus";
import type { DocumentType } from "@/constants/enum/DocumentType";
import type { pagination } from "@/types/pagination";

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
}

export interface TechnicalDocumentCreateDto {
    title: string;
    documentCode: string;
    description?: string | null;
    type: DocumentType;
    priority: IssueSeverity;
    externalDepartmentIds?: string[] | null;
    attachmentIds?: string[] | null;
    technicalSpecs: any;
}

export interface TechnicalDocumentUpdateDto {
    title: string;
    description?: string | null;
    type: DocumentType;
    priority: IssueSeverity;
    technicalSpecs?: any | null;
    externalDepartmentIds?: string[] | null;
}

export interface DocumentFilterDto extends pagination {
    searchTerm?: string | null;
    type?: DocumentType | null;
    departmentId?: string | null;
    status?: DocumentStatus | null;
    fromDate?: string | null;
    toDate?: string | null;
}