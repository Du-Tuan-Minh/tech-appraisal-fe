export const NotificationType = {
    System: 1,
    Assignment: 2,
    AppraisalComment: 3,
    WorkflowResult: 4,
    DeadlineReminder: 5,
    IssueReported: 6,
    DocumentMention: 7
} as const;

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export const NOTIFICATION_TYPE_MAP: Record<NotificationType, { label: string; color: string }> = {
    [NotificationType.System]: {
        label: "Hệ thống",
        color: "text-gray-400 bg-gray-900/20"
    },
    [NotificationType.Assignment]: {
        label: "Phân công nhiệm vụ",
        color: "text-blue-400 bg-blue-900/20"
    },
    [NotificationType.AppraisalComment]: {
        label: "Ý kiến thẩm định mới",
        color: "text-purple-400 bg-purple-900/20"
    },
    [NotificationType.WorkflowResult]: {
        label: "Kết quả phê duyệt",
        color: "text-emerald-400 bg-emerald-900/20"
    },
    [NotificationType.DeadlineReminder]: {
        label: "Nhắc nhở hạn xử lý",
        color: "text-amber-400 bg-amber-900/20"
    },
    [NotificationType.IssueReported]: {
        label: "Báo cáo lỗi kỹ thuật",
        color: "text-red-400 bg-red-900/20"
    },
    [NotificationType.DocumentMention]: {
        label: "Nhắc tên trong thảo luận",
        color: "text-indigo-400 bg-indigo-900/20"
    }
};