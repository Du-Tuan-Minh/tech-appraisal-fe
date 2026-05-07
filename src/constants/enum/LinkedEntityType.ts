export const LinkedEntityType = {
    TechnicalDocument: 1,
    RequestVersion: 2,
    FeedbackIssue: 3,
    TechnicalKnowledgeBase: 4,
    AppraisalHistory: 5,
    FeedbackComment: 6
} as const;

export type LinkedEntityType = (typeof LinkedEntityType)[keyof typeof LinkedEntityType];

export const LINKED_ENTITY_TYPE_MAP: Record<LinkedEntityType, { label: string; color: string }> = {
    [LinkedEntityType.TechnicalDocument]: {
        label: "Tài liệu kỹ thuật",
        color: "text-blue-400 bg-blue-900/20"
    },
    [LinkedEntityType.RequestVersion]: {
        label: "Phiên bản yêu cầu",
        color: "text-indigo-400 bg-indigo-900/20"
    },
    [LinkedEntityType.FeedbackIssue]: {
        label: "Vấn đề phản hồi",
        color: "text-red-400 bg-red-900/20"
    },
    [LinkedEntityType.TechnicalKnowledgeBase]: {
        label: "Cơ sở tri thức kỹ thuật",
        color: "text-emerald-400 bg-emerald-900/20"
    },
    [LinkedEntityType.AppraisalHistory]: {
        label: "Lịch sử thẩm định",
        color: "text-amber-400 bg-amber-900/20"
    },
    [LinkedEntityType.FeedbackComment]: {
        label: "Bình luận phản hồi",
        color: "text-purple-400 bg-purple-900/20"
    }
};