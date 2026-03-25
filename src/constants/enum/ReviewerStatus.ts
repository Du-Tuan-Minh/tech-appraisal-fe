export const ReviewerStatus = {
    Reviewing: 0,
    Submitted: 1,
    Rejected: 2,
    Accepted: 3,
} as const;

export type ReviewerStatus =
    typeof ReviewerStatus[keyof typeof ReviewerStatus];

export const REVIEWER_STATUS_LABELS: Record<ReviewerStatus, string> = {
    [ReviewerStatus.Reviewing]: "Đang đánh giá",
    [ReviewerStatus.Submitted]: "Đã nộp",
    [ReviewerStatus.Rejected]: "Từ chối",
    [ReviewerStatus.Accepted]: "Chấp nhận",
};