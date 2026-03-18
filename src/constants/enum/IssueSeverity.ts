export const IssueSeverity = {
    Information: 1,
    Low: 2,
    Medium: 3,
    Warning: 4,
    High: 5,
    Critical: 6
} as const;

export type IssueSeverity =
    (typeof IssueSeverity)[keyof typeof IssueSeverity];
