export const IssueStatus = {
    New: 1,
    InProcessing: 2,
    Adjusted: 3,
    Closed: 4,
    Rejected: 5
} as const;

export type IssueStatus = (typeof IssueStatus)[keyof typeof IssueStatus];

export const ISSUE_STATUS_MAP: Record<IssueStatus, { label: string; color: string }> = {
    [IssueStatus.New]: {
        label: "Mới ghi nhận",
        color: "text-blue-400 bg-blue-900/20"
    },
    [IssueStatus.InProcessing]: {
        label: "Đang xử lý",
        color: "text-yellow-400 bg-yellow-900/20"
    },
    [IssueStatus.Adjusted]: {
        label: "Đã điều chỉnh tài liệu",
        color: "text-indigo-400 bg-indigo-900/20"
    },
    [IssueStatus.Closed]: {
        label: "Đã đóng triệt để",
        color: "text-green-400 bg-green-900/20"
    },
    [IssueStatus.Rejected]: {
        label: "Không phải lỗi/Từ chối",
        color: "text-gray-400 bg-gray-900/20"
    }
};