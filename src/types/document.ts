import type { IssueSeverity } from "@/constants/enum/IssueSeverity";
import type { DocumentStatus } from "@/constants/enum/DocumentStatus";
import type { DocumentVersionDto } from "@/types/version";
import type { AttachmentResponseDto } from "@/types/attachment";
import type { AppraisalHistoryResponseDto } from "@/types/history";
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
    totalVersions: number;
}

export interface TechnicalDocumentDetailDto extends TechnicalDocumentResponseDto {
    currentHandlerName?: string | null;
    requesterId: string;
    currentVersion?: DocumentVersionDto | null;
    attachments: AttachmentResponseDto[];
    histories: AppraisalHistoryResponseDto[];
}

export interface TechnicalDocumentCreateDto {
    title: string;
    description: string;
    type: DocumentType;
    priority: IssueSeverity;
    technicalSpecsJson: string;
}

export interface TechnicalDocumentUpdateDto {
    title: string;
    description: string;
    type: DocumentType;
    priority: IssueSeverity;

    technicalSpecsJson: string;
}

export interface DocumentFilterDto extends pagination {
    searchTerm?: string | null;
    type?: DocumentType | null;
    departmentId?: string | null;
    status?: DocumentStatus | null;
    fromDate?: string | null;
    toDate?: string | null;
}