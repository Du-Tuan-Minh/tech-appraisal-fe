export const AttachmentCategory = {
    SupportingEvidence: 1,
    AppraisalProof: 2,
    IssueEvidence: 3,
    MainDocumentDraft: 4,
    FinalSignedDocument: 5,
    ManufacturerDatasheet: 6,
    Other: 99
} as const;

export type AttachmentCategory = (typeof AttachmentCategory)[keyof typeof AttachmentCategory];

export const ATTACHMENT_CATEGORY_LABELS: Record<AttachmentCategory, string> = {
    [AttachmentCategory.SupportingEvidence]: "Tài liệu sở cứ",
    [AttachmentCategory.AppraisalProof]: "Minh chứng thẩm định",
    [AttachmentCategory.IssueEvidence]: "Minh chứng lỗi thực tế",
    [AttachmentCategory.MainDocumentDraft]: "Bản thảo tài liệu",
    [AttachmentCategory.FinalSignedDocument]: "Bản chính thức (Đã ký/Đóng dấu)",
    [AttachmentCategory.ManufacturerDatasheet]: "Datasheet từ nhà sản xuất",
    [AttachmentCategory.Other]: "Khác"
};