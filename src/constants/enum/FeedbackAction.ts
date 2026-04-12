export const FeedbackAction = {
    Pending: 0,
    AgreeToEdit: 1,
    ExplainAndKeep: 2
} as const;

export type FeedbackAction = (typeof FeedbackAction)[keyof typeof FeedbackAction];

export const FEEDBACK_ACTION_LABELS: Record<FeedbackAction, string> = {
    [FeedbackAction.Pending]: "Chờ phản hồi",
    [FeedbackAction.AgreeToEdit]: "Đồng ý chỉnh sửa",
    [FeedbackAction.ExplainAndKeep]: "Giải trình & Giữ nguyên"
};