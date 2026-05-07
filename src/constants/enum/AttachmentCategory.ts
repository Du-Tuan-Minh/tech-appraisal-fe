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

export const ATTACHMENT_CATEGORY_MAP: Record<AttachmentCategory, { label: string; color: string; icon?: string }> = {
    [AttachmentCategory.SupportingEvidence]: {
        label: "Tài liệu sở cứ",
        color: "text-blue-400 bg-blue-900/20",
    },
    [AttachmentCategory.AppraisalProof]: {
        label: "Minh chứng thẩm định",
        color: "text-green-400 bg-green-900/20",
    },
    [AttachmentCategory.IssueEvidence]: {
        label: "Minh chứng lỗi thực tế",
        color: "text-red-400 bg-red-900/20",
    },
    [AttachmentCategory.MainDocumentDraft]: {
        label: "Bản thảo tài liệu",
        color: "text-yellow-400 bg-yellow-900/20",
    },
    [AttachmentCategory.FinalSignedDocument]: {
        label: "Bản chính thức (Đã ký/Đóng dấu)",
        color: "text-emerald-400 bg-emerald-900/20",
    },
    [AttachmentCategory.ManufacturerDatasheet]: {
        label: "Datasheet từ nhà sản xuất",
        color: "text-purple-400 bg-purple-900/20",
    },
    [AttachmentCategory.Other]: {
        label: "Khác",
        color: "text-gray-400 bg-gray-900/20",
    },
};