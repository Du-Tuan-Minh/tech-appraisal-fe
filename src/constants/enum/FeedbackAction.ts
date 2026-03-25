export const FeedbackAction = {
    AgreeToEdit: 0,
    ExplainAndKeep: 1
} as const;

export type FeedbackAction =
    (typeof FeedbackAction)[keyof typeof FeedbackAction];

export const FEEDBACK_ACTION_LABELS: Record<FeedbackAction, string> = {
    [FeedbackAction.AgreeToEdit]: "Đồng ý chỉnh sửa",
    [FeedbackAction.ExplainAndKeep]: "Giải trình & Giữ nguyên"
};