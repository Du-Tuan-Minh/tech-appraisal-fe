import type { DocumentStatus } from "@/constants/enum/DocumentStatus";
import type { IssueCategory } from "@/constants/enum/IssueCategory";
import type { IssueSeverity } from "@/constants/enum/IssueSeverity";
import type { FeedbackIssueResponseDto } from "@/types/feedback";

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
    newIssues: FeedbackIssueBaseDto[];
    attachmentIds: (string | null)[];
}

export interface FeedbackIssueBaseDto {
    indicatorPath: string;
    description: string;
    issueCategory: IssueCategory;
    severity: IssueSeverity;
    technicalKnowledgeBaseId?: string | null;
}