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

export const ISSUE_SEVERITY_LABELS: Record<IssueSeverity, string> = {
    [IssueSeverity.Information]: "Thông tin",
    [IssueSeverity.Low]: "Thấp",
    [IssueSeverity.Medium]: "Trung bình",
    [IssueSeverity.Warning]: "Cảnh báo",
    [IssueSeverity.High]: "Cao",
    [IssueSeverity.Critical]: "Nghiêm trọng"
};