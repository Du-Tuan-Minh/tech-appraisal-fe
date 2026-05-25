export const ManagerDashboardDocumentType = {
    InternalSigning: 0,
    PendingReview: 1,
    NeedConfirmation: 2,
    Rejected: 3
} as const;

export type ManagerDashboardDocumentType =
    (typeof ManagerDashboardDocumentType)[keyof typeof ManagerDashboardDocumentType];

export const MANAGER_DASHBOARD_DOCUMENT_TYPE_MAP: Record<
    ManagerDashboardDocumentType,
    { label: string; color: string }
> = {
    [ManagerDashboardDocumentType.InternalSigning]: {
        label: "Ký nội bộ",
        color: "text-blue-400 bg-blue-900/20"
    },
    [ManagerDashboardDocumentType.PendingReview]: {
        label: "Đang thẩm định",
        color: "text-yellow-400 bg-yellow-900/20"
    },
    [ManagerDashboardDocumentType.NeedConfirmation]: {
        label: "Cần xác nhận",
        color: "text-cyan-400 bg-cyan-900/20"
    },
    [ManagerDashboardDocumentType.Rejected]: {
        label: "Bị từ chối",
        color: "text-red-400 bg-red-900/20"
    }
};