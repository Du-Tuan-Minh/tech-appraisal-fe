import type { FeedbackIssueResponseDto } from "@/types/feedback";
import type { AttachmentResponseDto } from "@/types/attachment";

export interface DocumentVersionDto {
    id: string;
    requestId: string;
    versionNumber: number;
    changeReason?: string | null;
    isCurrent: boolean;
    createdAt: string;
    technicalSpecsJson?: any | null;
    sourceIssueId?: string | null;
}

export interface DocumentVersionDetailDto extends DocumentVersionDto {
    issuesReported: FeedbackIssueResponseDto[];
    issuesResolved: FeedbackIssueResponseDto[];
    attachments: AttachmentResponseDto[];
}

export interface DocumentVersionCreateDto {
    requestId: string;
    technicalSpecsJson: any;
    changeReason?: string | null;
    sourceIssueId?: string | null;
}