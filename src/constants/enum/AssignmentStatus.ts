export const AssignmentStatus = {
    Pending: 0,
    InReview: 1,
    Completed: 2,
    AwaitingClarification: 3,
    Overdue: 4,
    Skipped: 5
} as const;

export type AssignmentStatus = (typeof AssignmentStatus)[keyof typeof AssignmentStatus];

export const ASSIGNMENT_STATUS_LABELS: Record<AssignmentStatus, string> = {
    [AssignmentStatus.Pending]: "Chờ xử lý",
    [AssignmentStatus.InReview]: "Đang thẩm định",
    [AssignmentStatus.Completed]: "Đã hoàn thành",
    [AssignmentStatus.AwaitingClarification]: "Chờ giải trình",
    [AssignmentStatus.Overdue]: "Quá hạn xử lý",
    [AssignmentStatus.Skipped]: "Bị bỏ qua (Director)"
};