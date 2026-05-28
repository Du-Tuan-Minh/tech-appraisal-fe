export const DepartmentDocumentStatusType = {
    Reviewing: 0,
    OverdueReview: 1,
    Issued: 2,
    Rejected: 3
} as const;

export type DepartmentDocumentStatusType =
    (typeof DepartmentDocumentStatusType)[keyof typeof DepartmentDocumentStatusType];

export const DEPARTMENT_DOCUMENT_STATUS_TYPE_MAP: Record<
    DepartmentDocumentStatusType,
    { label: string; color: string }
> = {
    [DepartmentDocumentStatusType.Reviewing]: {
        label: "Đang thẩm định",
        color: "text-yellow-400 bg-yellow-900/20"
    },
    [DepartmentDocumentStatusType.OverdueReview]: {
        label: "Quá hạn thẩm định",
        color: "text-orange-400 bg-orange-900/20"
    },
    [DepartmentDocumentStatusType.Issued]: {
        label: "Đã ban hành",
        color: "text-green-400 bg-green-900/20"
    },
    [DepartmentDocumentStatusType.Rejected]: {
        label: "Bị từ chối",
        color: "text-red-400 bg-red-900/20"
    }
};