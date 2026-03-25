export interface RejectionReasonResponseDto {
    id: string;
    appraisalHistoryId: string;
    documentId: string;
    documentTitle: string;
    documentVersionId: string;
    versionNumber: number;
    category: string;
    description: string;
    isAiGenerated: boolean;
    createdAt: string;
}

export interface RejectionReasonCreateDto {
    category: string;
    description: string;
    indicatorPath?: string | null;
    isAiGenerated?: boolean;
}