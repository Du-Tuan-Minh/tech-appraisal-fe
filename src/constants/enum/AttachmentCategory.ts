export const AttachmentCategory = {
    SupportingEvidence: 1,
    AppraisalProof: 2,
    IssueEvidence: 3,
    MainDocumentScan: 4
} as const;

export type AttachmentCategory =
    (typeof AttachmentCategory)[keyof typeof AttachmentCategory];
