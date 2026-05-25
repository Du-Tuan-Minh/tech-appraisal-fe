export const StaffDashboardDocumentType = {
    Draft: 0,
    ReturnedForRevision: 1,
    InternalReview: 2,
    Appraisal: 3,
    Signing: 4,
    Issued: 5
} as const;

export type StaffDashboardDocumentType =
    (typeof StaffDashboardDocumentType)[keyof typeof StaffDashboardDocumentType];

export const STAFF_DASHBOARD_DOCUMENT_TYPE_MAP: Record<
    StaffDashboardDocumentType,
    { label: string; color: string }
> = {
    [StaffDashboardDocumentType.Draft]: {
        label: "Bản nháp",
        color: "text-gray-400 bg-gray-900/20"
    },

    [StaffDashboardDocumentType.ReturnedForRevision]: {
        label: "Cần chỉnh sửa",
        color: "text-red-400 bg-red-900/20"
    },

    [StaffDashboardDocumentType.InternalReview]: {
        label: "Xét duyệt nội bộ",
        color: "text-blue-400 bg-blue-900/20"
    },

    [StaffDashboardDocumentType.Appraisal]: {
        label: "Đang thẩm định",
        color: "text-yellow-400 bg-yellow-900/20"
    },

    [StaffDashboardDocumentType.Signing]: {
        label: "Đang ký",
        color: "text-cyan-400 bg-cyan-900/20"
    },

    [StaffDashboardDocumentType.Issued]: {
        label: "Đã ban hành",
        color: "text-green-400 bg-green-900/20"
    }
};