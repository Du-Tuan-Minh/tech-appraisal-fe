export const IssueSeverity = {
    Minor: 1,
    Moderate: 2,
    Serious: 3,
    Critical: 4
} as const;

export type IssueSeverity = (typeof IssueSeverity)[keyof typeof IssueSeverity];

export const ISSUE_SEVERITY_LABELS: Record<IssueSeverity, string> = {
    [IssueSeverity.Minor]: "Thấp (Trình bày/Chính tả)",
    [IssueSeverity.Moderate]: "Trung bình (Thiếu sở cứ/Thuật ngữ)",
    [IssueSeverity.Serious]: "Cao (Sai chỉ tiêu/Phương pháp)",
    [IssueSeverity.Critical]: "Nghiêm trọng (Vi phạm quy chuẩn/An toàn)"
};