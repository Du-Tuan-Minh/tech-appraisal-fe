export const DocumentStatus = {
    Draft: 0,
    InternalPending: 1,
    AppraisalPending: 2,
    Appraising: 3,
    Consolidated: 4,
    Signing: 5,
    Approved: 6,
    Issued: 7,
    FeedbackReceived: 8,
    Improving: 9,
    Rejected: 10
} as const;

export type DocumentStatus =
    (typeof DocumentStatus)[keyof typeof DocumentStatus];

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
    [DocumentStatus.Draft]: "Bản nháp",
    [DocumentStatus.InternalPending]: "Chờ duyệt nội bộ",
    [DocumentStatus.AppraisalPending]: "Chờ thẩm định",
    [DocumentStatus.Appraising]: "Đang thẩm định",
    [DocumentStatus.Consolidated]: "Đã tổng hợp",
    [DocumentStatus.Signing]: "Đang trình ký",
    [DocumentStatus.Approved]: "Đã phê duyệt",
    [DocumentStatus.Issued]: "Đã ban hành",
    [DocumentStatus.FeedbackReceived]: "Đã nhận phản hồi",
    [DocumentStatus.Improving]: "Đang hoàn thiện",
    [DocumentStatus.Rejected]: "Bị từ chối"
};