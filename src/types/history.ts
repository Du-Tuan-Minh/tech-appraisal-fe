import type { DocumentStatus } from "@/constants/enum/DocumentStatus";
import type { FeedbackIssueResponseDto, FeedbackIssueCreateDto } from "@/types/feedback";

export interface AppraisalHistoryResponseDto {
    id: string;
    documentId: string;
    documentTitle: string;
    requestVersionId: string;
    versionNumber: number;
    handlerId: string;
    handlerName: string;
    oldStatus: DocumentStatus;
    newStatus: DocumentStatus;
    appraisalAssignmentId?: string | null;
    comment?: string | null;
    createdAt: string;
    linkedIssues: FeedbackIssueResponseDto[];
}

export interface AppraisalHistoryCreateDto {
    documentId: string;
    appraisalAssignmentId?: string | null;
    comment?: string | null;
    newIssues: FeedbackIssueCreateDto[];
    attachmentIds: string[];
}