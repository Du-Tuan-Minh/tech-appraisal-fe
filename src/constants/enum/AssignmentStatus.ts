export const AssignmentStatus = {
    Pending: 0,
    Completed: 1,
    Rejected: 2
} as const;

export type AssignmentStatus =
    (typeof AssignmentStatus)[keyof typeof AssignmentStatus];

export const ASSIGNMENT_STATUS_LABELS: Record<AssignmentStatus, string> = {
    [AssignmentStatus.Pending]: "Chờ xử lý",
    [AssignmentStatus.Completed]: "Hoàn thành",
    [AssignmentStatus.Rejected]: "Từ chối"
};