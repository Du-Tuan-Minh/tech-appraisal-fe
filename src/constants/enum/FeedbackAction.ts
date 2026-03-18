export const FeedbackAction = {
    AgreeToEdit: 0,
    ExplainAndKeep: 1
} as const;

export type FeedbackAction =
    (typeof FeedbackAction)[keyof typeof FeedbackAction];
