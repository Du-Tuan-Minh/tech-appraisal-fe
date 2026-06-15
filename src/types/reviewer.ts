import type { ReviewerStatus } from "@/constants/enum/ReviewerStatus";
import type { FeedbackIssueCreateDto } from "@/types/feedback";

export interface AppraisalReviewerDto {
    id: string;
    staffName: string;
    status: ReviewerStatus;
    employeeCode: string;
}

export interface AppraisalReviewerDetailDto extends AppraisalReviewerDto {
    assignmentId: string;
    staffId: string;
    departmentName: string;
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