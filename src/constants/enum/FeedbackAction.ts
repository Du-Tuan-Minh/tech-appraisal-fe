export const FeedbackAction = {
    Pending: 0,
    AgreeToEdit: 1,
    ExplainAndKeep: 2
} as const;

export type FeedbackAction = (typeof FeedbackAction)[keyof typeof FeedbackAction];

export const FEEDBACK_ACTION_MAP: Record<FeedbackAction, { label: string; color: string }> = {
    [FeedbackAction.Pending]: {
        label: "Chờ phản hồi",
        color: "text-yellow-400 bg-yellow-900/20"
    },
    [FeedbackAction.AgreeToEdit]: {
        label: "Đồng ý chỉnh sửa",
        color: "text-green-400 bg-green-900/20"
    },
    [FeedbackAction.ExplainAndKeep]: {
        label: "Giải trình & Giữ nguyên",
        color: "text-blue-400 bg-blue-900/20"
    }
};