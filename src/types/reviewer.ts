import type { ReviewerStatus } from "@/constants/enum/ReviewerStatus";
import type { FeedbackIssueCreateDto } from "@/types/feedback-issue";

export interface AppraisalReviewerDto {
    id: string;
    assignmentId: string;
    staffId: string;
    staffName: string;
    departmentName: string;
    status: ReviewerStatus;
    taskDescription?: string | null;
    comment?: string | null;
    deadline?: string | null;
    completedAt?: string | null;
    createdAt: string;
    issueCount: number;
    attachmentCount: number;
}

export interface UpdateReviewerProgressRequest {
    reviewerId: string;
    status: ReviewerStatus;
    comment?: string | null;
    newIssues: FeedbackIssueCreateDto[];
    attachmentIds: string[];
}