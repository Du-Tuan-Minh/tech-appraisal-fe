export const IssueSeverity = {
    Minor: 1,
    Moderate: 2,
    Serious: 3,
    Critical: 4
} as const;

export type IssueSeverity = (typeof IssueSeverity)[keyof typeof IssueSeverity];

export const ISSUE_SEVERITY_LABELS: Record<IssueSeverity, string> = {
    [IssueSeverity.Minor]: "Thấp",
    [IssueSeverity.Moderate]: "Trung bình",
    [IssueSeverity.Serious]: "Cao",
    [IssueSeverity.Critical]: "Quan trọng"
};