export const DocumentStatus = {
    Draft: 0,
    InternalPending: 1,
    AppraisalPending: 2,
    Appraising: 3,
    Consolidated: 4,
    Signing: 5,
    Approved: 6,
    Issued: 7,
    FeedbackReceived: 8,
    Improving: 9,
    Rejected: 10
} as const;

export type DocumentStatus =
    (typeof DocumentStatus)[keyof typeof DocumentStatus];

