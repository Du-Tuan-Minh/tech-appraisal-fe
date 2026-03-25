export const ReviewerStatus = {
    Reviewing: 0,
    Submitted: 1,
    Rejected: 2,
    Accepted: 3,
} as const;

export type ReviewerStatus =
    typeof ReviewerStatus[keyof typeof ReviewerStatus];