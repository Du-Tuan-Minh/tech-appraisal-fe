export const AssignmentStatus = {
    Pending: 0,
    InReview: 1,
    Completed: 2,
    AwaitingClarification: 3,
    Overdue: 4,
    Skipped: 5
} as const;

export type AssignmentStatus = (typeof AssignmentStatus)[keyof typeof AssignmentStatus];

export const ASSIGNMENT_STATUS_MAP: Record<AssignmentStatus, { label: string; color: string }> = {
    [AssignmentStatus.Pending]: {
        label: "Chờ xử lý",
        color: "text-yellow-400 bg-yellow-900/20"
    },
    [AssignmentStatus.InReview]: {
        label: "Đang thẩm định",
        color: "text-blue-400 bg-blue-900/20"
    },
    [AssignmentStatus.Completed]: {
        label: "Đã hoàn thành",
        color: "text-green-400 bg-green-900/20"
    },
    [AssignmentStatus.AwaitingClarification]: {
        label: "Chờ giải trình",
        color: "text-purple-400 bg-purple-900/20"
    },
    [AssignmentStatus.Overdue]: {
        label: "Quá hạn xử lý",
        color: "text-red-400 bg-red-900/20"
    },
    [AssignmentStatus.Skipped]: {
        label: "Bị bỏ qua",
        color: "text-gray-400 bg-gray-900/20"
    },
};