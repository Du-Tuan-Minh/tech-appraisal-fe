export const IssueStatus = {
    New: 1,
    InProcessing: 2,
    Adjusted: 3,
    Closed: 4,
    Rejected: 5
} as const;

export type IssueStatus = (typeof IssueStatus)[keyof typeof IssueStatus];

export const ISSUE_STATUS_LABELS: Record<IssueStatus, string> = {
    [IssueStatus.New]: "Mới ghi nhận",
    [IssueStatus.InProcessing]: "Đang xử lý",
    [IssueStatus.Adjusted]: "Đã điều chỉnh tài liệu",
    [IssueStatus.Closed]: "Đã đóng triệt để",
    [IssueStatus.Rejected]: "Không phải lỗi/Từ chối"
};