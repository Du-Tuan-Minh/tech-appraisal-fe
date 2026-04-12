export const ReviewerStatus = {
    Pending: 0,
    Reviewing: 1,
    Completed: 2
} as const;

export type ReviewerStatus = (typeof ReviewerStatus)[keyof typeof ReviewerStatus];

export const REVIEWER_STATUS_LABELS: Record<ReviewerStatus, string> = {
    [ReviewerStatus.Pending]: "Chờ thẩm định",
    [ReviewerStatus.Reviewing]: "Đang thẩm định",
    [ReviewerStatus.Completed]: "Đã hoàn thành"
};