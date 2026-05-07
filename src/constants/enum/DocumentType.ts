export const DocumentType = {
    TechnicalSpecifications: 0,
    TechnicalRequirements: 1,
    ContractAppendix: 2,
    ProductInspectionGuide: 3
} as const;

export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType];

export const DOCUMENT_TYPE_MAP: Record<DocumentType, { label: string; color: string }> = {
    [DocumentType.TechnicalSpecifications]: {
        label: "Chỉ tiêu kỹ thuật",
        color: "text-blue-400 bg-blue-900/20"
    },
    [DocumentType.TechnicalRequirements]: {
        label: "Yêu cầu kỹ thuật",
        color: "text-indigo-400 bg-indigo-900/20"
    },
    [DocumentType.ContractAppendix]: {
        label: "Phụ lục chỉ tiêu kỹ thuật hợp đồng",
        color: "text-purple-400 bg-purple-900/20"
    },
    [DocumentType.ProductInspectionGuide]: {
        label: "Tài liệu kiểm tra sản phẩm",
        color: "text-amber-400 bg-amber-900/20"
    }
};