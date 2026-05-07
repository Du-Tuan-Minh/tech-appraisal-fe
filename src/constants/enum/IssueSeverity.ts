export const IssueSeverity = {
    Minor: 1,
    Moderate: 2,
    Serious: 3,
    Critical: 4
} as const;

export type IssueSeverity = (typeof IssueSeverity)[keyof typeof IssueSeverity];

export const ISSUE_SEVERITY_MAP: Record<IssueSeverity, { label: string; color: string }> = {
    [IssueSeverity.Minor]: {
        label: "Thấp",
        color: "text-green-400 bg-green-900/20"
    },
    [IssueSeverity.Moderate]: {
        label: "Trung bình",
        color: "text-yellow-400 bg-yellow-900/20"
    },
    [IssueSeverity.Serious]: {
        label: "Cao",
        color: "text-orange-400 bg-orange-900/20"
    },
    [IssueSeverity.Critical]: {
        label: "Quan trọng",
        color: "text-red-500 bg-red-900/30 border border-red-500/20"
    }
};