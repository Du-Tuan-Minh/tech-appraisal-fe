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

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
    [DocumentStatus.Draft]: "Bản nháp",
    [DocumentStatus.InternalPending]: "Chờ duyệt nội bộ",
    [DocumentStatus.InternalApproved]: "Đã duyệt nội bộ",
    [DocumentStatus.AppraisalPending]: "Chờ phân công thẩm định",
    [DocumentStatus.Appraising]: "Đang thẩm định đa bên",
    [DocumentStatus.AdjustmentRequired]: "Yêu cầu điều chỉnh",
    [DocumentStatus.Signing]: "Đang trình ký ban hành",
    [DocumentStatus.Issued]: "Đã ban hành chính thức",
    [DocumentStatus.FeedbackReceived]: "Ghi nhận phản hồi lỗi",
    [DocumentStatus.UnderImprovement]: "Đang cải tiến/Cập nhật",
    [DocumentStatus.Rejected]: "Bị từ chối/Hủy bỏ",
    [DocumentStatus.Archived]: "Lưu trữ/Hết hiệu lực"
};