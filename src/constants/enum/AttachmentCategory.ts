export const AttachmentCategory = {
    SupportingEvidence: 1,
    AppraisalProof: 2,
    IssueEvidence: 3,
    MainDocumentScan: 4
} as const;

export type AttachmentCategory =
    (typeof AttachmentCategory)[keyof typeof AttachmentCategory];

export const ATTACHMENT_CATEGORY_LABELS: Record<AttachmentCategory, string> = {
    [AttachmentCategory.SupportingEvidence]: "Tài liệu bổ trợ",
    [AttachmentCategory.AppraisalProof]: "Bằng chứng thẩm định",
    [AttachmentCategory.IssueEvidence]: "Minh chứng lỗi/vấn đề",
    [AttachmentCategory.MainDocumentScan]: "Bản quét tài liệu chính"
};