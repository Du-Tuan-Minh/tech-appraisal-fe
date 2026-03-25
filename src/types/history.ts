import type { DocumentStatus } from "@/constants/enum/DocumentStatus";
import type { RejectionReasonResponseDto } from "@/types/rejection-reason";
import type { RejectionReasonCreateDto } from "@/types/rejection-reason";

export interface AppraisalHistoryResponseDto {
    id: string;
    documentId: string;
    documentTitle: string;
    handlerId: string;
    handlerName: string;
    oldStatus: DocumentStatus;
    newStatus: DocumentStatus;
    comment: string | null;
    indicatorPath: string | null;
    isAiEvaluated: boolean;
    createdAt: string;
    rejectionReasons: RejectionReasonResponseDto[];
}

export interface AppraisalHistoryCreateDto {
    documentId: string;
    comment: string | null;
    isAiEvaluated: boolean;
    reasons: RejectionReasonCreateDto[] | null;
    attachmentIds: string[] | null;
}
