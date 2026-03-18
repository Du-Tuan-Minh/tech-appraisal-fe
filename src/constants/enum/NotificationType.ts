export const NotificationType = {
    System: 1,
    Appraisal: 2,
    Approval: 3,
    Feedback: 4,
    AiWarning: 5
} as const;

export type NotificationType =
    (typeof NotificationType)[keyof typeof NotificationType];

