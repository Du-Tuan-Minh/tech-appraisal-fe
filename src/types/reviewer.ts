import type { IssueSeverity } from "@/constants/enum/IssueSeverity";
import type { ReviewerStatus } from "@/constants/enum/ReviewerStatus";

export interface AppraisalReviewerDto {
    id: string;
    assignmentId: string;
    staffId: string;
    staffName: string;
    status: ReviewerStatus;
    comment: string | null;
    completedAt: string | null;
    createdAt: string;
}

export interface UpdateAppraisalReviewerDto {
    status: ReviewerStatus;
    comment: string | null;
    issues: FeedbackIssueReviewDto[] | null;
    attachmentIds: string[] | null;
}

export interface FeedbackIssueReviewDto {
    indicatorPath: string;
    description: string;
    issueType: string | null;
    severity: IssueSeverity;
}