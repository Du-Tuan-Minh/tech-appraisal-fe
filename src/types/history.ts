import type { DocumentStatus } from "@/constants/enum/DocumentStatus";
import type { FeedbackIssueResponseDto } from "@/types/feedback";

export interface AppraisalHistoryResponseDto {
    id: string; // Guid
    documentId: string; // Guid
    documentTitle: string;
    requestVersionId: string; // Guid
    versionNumber: number;
    handlerId: string; // Guid
    handlerName: string;
    oldStatus: DocumentStatus;
    newStatus: DocumentStatus;
    appraisalAssignmentId?: string | null; // Guid?
    comment?: string | null;
    createdAt: string; // DateTime
    linkedIssues: FeedbackIssueResponseDto[]; // List<>
}

export interface AppraisalRejectDto {
    documentId: string; // [Required] Guid
    appraisalAssignmentId?: string | null; // Guid?
    comment?: string | null; // MaxLength(2000)
    newIssues: FeedbackIssueResponseDto[]; // List<>
    attachmentIds: (string | null)[]; // List<Guid?> - Giữ mảng string để FE dễ handle
}