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

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
    [NotificationType.System]: "Hệ thống",
    [NotificationType.Assignment]: "Phân công nhiệm vụ",
    [NotificationType.AppraisalComment]: "Ý kiến thẩm định mới",
    [NotificationType.WorkflowResult]: "Kết quả phê duyệt",
    [NotificationType.DeadlineReminder]: "Nhắc nhở hạn xử lý",
    [NotificationType.IssueReported]: "Báo cáo lỗi kỹ thuật",
    [NotificationType.DocumentMention]: "Nhắc tên trong thảo luận"
};