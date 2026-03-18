export const AssignmentStatus = {
    Pending: 0,
    Completed: 1,
    Rejected: 2
} as const;

export type AssignmentStatus =
    (typeof AssignmentStatus)[keyof typeof AssignmentStatus];

