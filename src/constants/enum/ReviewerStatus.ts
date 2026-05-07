export const ReviewerStatus = {
    Pending: 0,
    Reviewing: 1,
    Completed: 2,
    Skipped: 3
} as const;

export type ReviewerStatus = (typeof ReviewerStatus)[keyof typeof ReviewerStatus];

export const REVIEWER_STATUS_MAP: Record<ReviewerStatus, { label: string; color: string }> = {
    [ReviewerStatus.Pending]: {
        label: "Chờ thẩm định",
        color: "text-gray-400 bg-gray-900/20"
    },
    [ReviewerStatus.Reviewing]: {
        label: "Đang thẩm định",
        color: "text-blue-400 bg-blue-900/20"
    },
    [ReviewerStatus.Completed]: {
        label: "Đã hoàn thành",
        color: "text-green-400 bg-green-900/20"
    },
    [ReviewerStatus.Skipped]: {
        label: "Bị bỏ qua",
        color: "text-orange-400 bg-orange-900/20"
    }
};