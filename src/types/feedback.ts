import type { IssueSeverity } from "@/constants/enum/IssueSeverity";
import type { IssueStatus } from "@/constants/enum/IssueStatus";
import type { FeedbackAction } from "@/constants/enum/FeedbackAction";
import type { IssueCategory } from "@/constants/enum/IssueCategory";
import type { AttachmentResponseDto } from "@/types/attachment";

export interface FeedbackIssueResponseDto {
    id: string;
    documentId: string;
    requestVersionId: string;
    versionNumber: number;
    issueCategory: IssueCategory;
    severity: IssueSeverity;
    status: IssueStatus;
    assignedDepartmentId?: string | null;
    indicatorPath: string;
    description: string;
    assignedDepartmentName?: string | null;
    documentTitle: string;
}

export interface FeedbackIssueDetailDto extends FeedbackIssueResponseDto {
    reporterId: string;
    reporterName: string;
    technicalKnowledgeBaseId?: string | null;
    knowledgeBaseTitle?: string | null;
    resolvedInVersionId?: string | null;
    createdAt: string;
    attachmentCount: number;
    attachments?: AttachmentResponseDto[] | null;
}

export interface FeedbackIssueCreateDto {
    documentId: string;
    indicatorPath: string;
    description: string;
    issueCategory: IssueCategory;
    severity: IssueSeverity;
    technicalKnowledgeBaseId?: string | null;
    appraisalHistoryId?: string | null;
}

export interface FeedbackIssueUpdateDto {
    status: IssueStatus;
    assignedDepartmentId?: string | null;
    resolvedInVersionId?: string | null;
    resolutionNote?: string | null;
    issueCategory?: IssueCategory | null;
    severity?: IssueSeverity | null;
}

export interface FeedbackActionRequestDto {
    issueId: string;
    action: FeedbackAction;
    content: string;
    attachmentIds?: string[] | null;
    newTechnicalSpecs?: any;
}

export interface FeedbackResponseDto {
    action: FeedbackAction;
    comment: string;
    newIssues?: FeedbackIssueCreateDto[] | null;
    attachmentIds?: string[] | null;
}