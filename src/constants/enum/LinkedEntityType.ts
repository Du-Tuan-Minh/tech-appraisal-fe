export const LinkedEntityType = {
    TechnicalDocument: 1,
    RequestVersion: 2,
    FeedbackIssue: 3,
    TechnicalKnowledgeBase: 4,
    AppraisalHistory: 5
} as const;

export type LinkedEntityType = (typeof LinkedEntityType)[keyof typeof LinkedEntityType];

export const LINKED_ENTITY_TYPE_LABELS: Record<LinkedEntityType, string> = {
    [LinkedEntityType.TechnicalDocument]: "Tài liệu kỹ thuật",
    [LinkedEntityType.RequestVersion]: "Phiên bản yêu cầu",
    [LinkedEntityType.FeedbackIssue]: "Vấn đề phản hồi",
    [LinkedEntityType.TechnicalKnowledgeBase]: "Cơ sở tri thức kỹ thuật",
    [LinkedEntityType.AppraisalHistory]: "Lịch sử thẩm định"
};