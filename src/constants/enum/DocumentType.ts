export const DocumentType = {
    TechnicalSpecifications: 0,
    TechnicalRequirements: 1,
    ContractAppendix: 2,
    ProductInspectionGuide: 3
} as const;

export type DocumentType =
    (typeof DocumentType)[keyof typeof DocumentType];
