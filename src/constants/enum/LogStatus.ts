export const LogStatus = {
    Success: 1,
    Failure: 2
} as const;

export type LogStatus =
    (typeof LogStatus)[keyof typeof LogStatus];