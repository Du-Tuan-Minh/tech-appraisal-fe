export const DocumentStatus = {
    // GIAI ĐOẠN 1: XÂY DỰNG
    Draft: 0,
    InternalPending: 1,
    InternalApproved: 2,

    // GIAI ĐOẠN 2: THẨM ĐỊNH ĐA BÊN
    AppraisalPending: 3,
    Appraising: 4,
    AdjustmentRequired: 5,

    // GIAI ĐOẠN 3: PHÊ DUYỆT & BAN HÀNH
    Signing: 6,
    Issued: 7,

    // GIAI ĐOẠN 4: CẢI TIẾN
    FeedbackReceived: 8,
    UnderImprovement: 9,

    // TRẠNG THÁI CUỐI
    Rejected: 10,
    Archived: 11
} as const;

export type DocumentStatus = (typeof DocumentStatus)[keyof typeof DocumentStatus];

export const DOCUMENT_STATUS_MAP: Record<DocumentStatus, { label: string; color: string }> = {
    // GIAI ĐOẠN 1: XÂY DỰNG
    [DocumentStatus.Draft]: {
        label: "bản thảo",
        color: "text-gray-400 bg-gray-900/20"
    },
    [DocumentStatus.InternalPending]: {
        label: "Chờ duyệt nội bộ",
        color: "text-yellow-500 bg-yellow-900/20"
    },
    [DocumentStatus.InternalApproved]: {
        label: "Đã duyệt nội bộ",
        color: "text-yellow-400 bg-yellow-900/10"
    },

    // GIAI ĐOẠN 2: THẨM ĐỊNH ĐA BÊN
    [DocumentStatus.AppraisalPending]: {
        label: "Chờ phân công thẩm định",
        color: "text-blue-400 bg-blue-900/20"
    },
    [DocumentStatus.Appraising]: {
        label: "Đang thẩm định đa bên",
        color: "text-indigo-400 bg-indigo-900/20"
    },
    [DocumentStatus.AdjustmentRequired]: {
        label: "Yêu cầu điều chỉnh",
        color: "text-orange-400 bg-orange-900/20"
    },

    // GIAI ĐOẠN 3: PHÊ DUYỆT & BAN HÀNH
    [DocumentStatus.Signing]: {
        label: "Đang trình ký ban hành",
        color: "text-emerald-400 bg-emerald-900/20"
    },
    [DocumentStatus.Issued]: {
        label: "Đã ban hành chính thức",
        color: "text-green-500 bg-green-900/30 border border-green-500/20"
    },

    // GIAI ĐOẠN 4: CẢI TIẾN
    [DocumentStatus.FeedbackReceived]: {
        label: "Ghi nhận phản hồi lỗi",
        color: "text-purple-400 bg-purple-900/20"
    },
    [DocumentStatus.UnderImprovement]: {
        label: "Đang cải tiến/Cập nhật",
        color: "text-fuchsia-400 bg-fuchsia-900/20"
    },

    // TRẠNG THÁI CUỐI
    [DocumentStatus.Rejected]: {
        label: "Bị từ chối/Hủy bỏ",
        color: "text-red-400 bg-red-900/20"
    },
    [DocumentStatus.Archived]: {
        label: "Lưu trữ/Hết hiệu lực",
        color: "text-gray-500 bg-dark-800"
    },
};