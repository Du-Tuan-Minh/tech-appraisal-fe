import type { IssueSeverity } from "@/constants/enum/IssueSeverity";
import type { DocumentStatus } from "@/constants/enum/DocumentStatus";
import type { DocumentVersionDto } from "@/types/version";
import type { AttachmentResponseDto } from "@/types/attachment";
import type { AppraisalHistoryResponseDto } from "@/types/history";
import type { DocumentType } from "@/constants/enum/DocumentType";
import type { pagination } from "@/types/pagination";
import type { AppraisalAssignmentDto } from "./assignment";

export interface TechnicalDocumentResponseDto {
    id: string;
    title: string;
    description?: string | null;
    documentCode: string;
    type: DocumentType;
    priority: IssueSeverity;
    status: DocumentStatus;
    requesterId: string;
    requesterName: string;
    currentHandlerName?: string | null;
    createdAt: string;
    departmentId: string;
    departmentName: string;
    totalVersions: number;
    currentAssignmentId?: string | null;
    qrCode?: string | null;
    currentVersionId?: string | null;
}

export interface TechnicalDocumentDetailDto extends TechnicalDocumentResponseDto {
    currentHandlerId?: string | null;
    currentVersion?: DocumentVersionDto | null;
    attachments: AttachmentResponseDto[];
    histories: AppraisalHistoryResponseDto[];
    assignments: AppraisalAssignmentDto[];
}

export interface TechnicalDocumentCreateDto {
    title: string;
    documentCode: string;
    description?: string | null;
    type: DocumentType;
    priority: IssueSeverity;
    attachmentIds?: string[] | null;
    technicalSpecs?: any | null;
}

export interface TechnicalDocumentUpdateDto {
    title: string;
    description?: string | null;
    type: DocumentType;
    priority: IssueSeverity;
    technicalSpecs?: any | null;
}

export interface DocumentFilterDto extends pagination {
    searchTerm?: string | null;
    type?: DocumentType | null;
    departmentId?: string | null;
    status?: DocumentStatus | null;
    fromDate?: string | null;
    toDate?: string | null;
}