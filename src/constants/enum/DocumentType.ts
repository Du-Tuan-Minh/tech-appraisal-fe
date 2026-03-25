export const DocumentType = {
    TechnicalSpecifications: 0,
    TechnicalRequirements: 1,
    ContractAppendix: 2,
    ProductInspectionGuide: 3
} as const;

export type DocumentType =
    (typeof DocumentType)[keyof typeof DocumentType];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
    [DocumentType.TechnicalSpecifications]: "Thông số kỹ thuật",
    [DocumentType.TechnicalRequirements]: "Yêu cầu kỹ thuật",
    [DocumentType.ContractAppendix]: "Phụ lục hợp đồng",
    [DocumentType.ProductInspectionGuide]: "Hướng dẫn kiểm tra sản phẩm"
};