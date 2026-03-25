export const IssueStatus = {
    New: 1,
    Processing: 2,
    Resolved: 3,
    Closed: 4,
    Rejected: 5
} as const;

export type IssueStatus =
    (typeof IssueStatus)[keyof typeof IssueStatus];

export const ISSUE_STATUS_LABELS: Record<IssueStatus, string> = {
    [IssueStatus.New]: "Mới",
    [IssueStatus.Processing]: "Đang xử lý",
    [IssueStatus.Resolved]: "Đã giải quyết",
    [IssueStatus.Closed]: "Đã đóng",
    [IssueStatus.Rejected]: "Từ chối"
};