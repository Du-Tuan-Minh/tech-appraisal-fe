export const NotificationType = {
    System: 1,
    Appraisal: 2,
    Approval: 3,
    Feedback: 4,
    AiWarning: 5
} as const;

export type NotificationType =
    (typeof NotificationType)[keyof typeof NotificationType];

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
    [NotificationType.System]: "Hệ thống",
    [NotificationType.Appraisal]: "Thẩm định",
    [NotificationType.Approval]: "Phê duyệt",
    [NotificationType.Feedback]: "Phản hồi",
    [NotificationType.AiWarning]: "Cảnh báo AI"
};
