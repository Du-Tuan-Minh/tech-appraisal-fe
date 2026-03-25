import type { IssueSeverity } from "@/constants/enum/IssueSeverity";
import type { IssueStatus } from "@/constants/enum/IssueStatus";
import type { FeedbackAction } from "@/constants/enum/FeedbackAction";
import type { AttachmentResponseDto } from "@/types/attachment";

export interface FeedbackIssueResponseDto {
    id: string;
    documentId: string;
    documentTitle?: string | null;
    requestVersionId: string;
    reporterName?: string | null;
    issueType?: string | null;
    versionNumber: number;
    indicatorPath: string;
    description: string;
    severity: IssueSeverity;
    status: IssueStatus;
    technicalKnowledgeBaseId?: string | null;
    knowledgeBaseTitle?: string | null;
    createdAt: string;
    appraisalReviewerId?: string | null;
    attachments: AttachmentResponseDto[];
}

export interface FeedbackIssueCreateDto {
    documentId: string;
    requestVersionId: string;
    indicatorPath: string;
    description: string;
    issueType?: string;
    severity: IssueSeverity;
    technicalKnowledgeBaseId?: string | null;
    appraisalReviewerId?: string | null;
}

export interface FeedbackIssueUpdateDto {
    status: IssueStatus;
    resolutionNote?: string | null;
    issueType?: string | null;
}

export interface FeedbackResponseDto {
    action: FeedbackAction;
    newJsonContent?: string | null;
    content?: string | null;
    changeReason: string;
}