export const IssueStatus = {
    New: 1,
    Processing: 2,
    Resolved: 3,
    Closed: 4,
    Rejected: 5
} as const;

export type IssueStatus =
    (typeof IssueStatus)[keyof typeof IssueStatus];
