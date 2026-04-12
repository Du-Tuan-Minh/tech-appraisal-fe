export const IssueCategory = {
    TechnicalError: 0,
    MissingData: 1,
    InvalidStandard: 2,
    InconsistentLogic: 3
} as const;

export type IssueCategory = (typeof IssueCategory)[keyof typeof IssueCategory];

export const ISSUE_CATEGORY_LABELS: Record<IssueCategory, string> = {
    [IssueCategory.TechnicalError]: "Sai thông số kỹ thuật",
    [IssueCategory.MissingData]: "Thiếu dữ liệu sở cứ",
    [IssueCategory.InvalidStandard]: "Vi phạm quy chuẩn",
    [IssueCategory.InconsistentLogic]: "Mâu thuẫn logic hệ thống"
};