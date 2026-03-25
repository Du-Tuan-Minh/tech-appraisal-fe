import type { RejectionReasonResponseDto } from "@/types/rejection-reason";

export interface DocumentVersionDto {
    id: string;
    documentId: string;
    versionNumber: number;
    changeReason?: string | null;
    isCurrent: boolean;
    createdAt: string;
    technicalSpecsJson?: string | null;
    aiEvaluationResult?: string | null;
}

export interface DocumentVersionDetailDto extends DocumentVersionDto {
    technicalSpecsJson: string;
    rejectionReasons: RejectionReasonResponseDto[];
}

export interface DocumentVersionCreateDto {
    documentId: string;
    technicalSpecsJson: string;
    changeReason?: string | null;
    content: string;
}