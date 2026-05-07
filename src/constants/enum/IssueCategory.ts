export const IssueCategory = {
    TechnicalError: 0,
    MissingData: 1,
    InvalidStandard: 2,
    InconsistentLogic: 3
} as const;

export type IssueCategory = (typeof IssueCategory)[keyof typeof IssueCategory];

export const ISSUE_CATEGORY_MAP: Record<IssueCategory, { label: string; color: string }> = {
    [IssueCategory.TechnicalError]: {
        label: "Sai thông số kỹ thuật",
        color: "text-red-400 bg-red-900/20"
    },
    [IssueCategory.MissingData]: {
        label: "Thiếu dữ liệu sở cứ",
        color: "text-orange-400 bg-orange-900/20"
    },
    [IssueCategory.InvalidStandard]: {
        label: "Vi phạm quy chuẩn",
        color: "text-yellow-400 bg-yellow-900/20"
    },
    [IssueCategory.InconsistentLogic]: {
        label: "Mâu thuẫn logic hệ thống",
        color: "text-purple-400 bg-purple-900/20"
    }
};