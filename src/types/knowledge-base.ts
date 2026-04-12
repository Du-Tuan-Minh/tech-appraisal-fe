import type { IssueSeverity } from "@/constants/enum/IssueSeverity";
import type { pagination } from "@/types/pagination";

export interface TechnicalKnowledgeBaseResponseDto {
    id: string;
    title: string;
    linkedSpecPattern: any;
    technicalSolution: string;
    severity: IssueSeverity;
    occurrenceCount: number;
    isVerified: boolean;
    verifiedById?: string | null;
    verifiedByName?: string | null;
    lastVerifiedAt?: string | null;
    createdAt: string;
}

export interface TechnicalKnowledgeBaseCreateDto {
    title: string;
    linkedSpecPattern: any;
    technicalSolution: string;
    severity: IssueSeverity;
}

export interface TechnicalKnowledgeBaseUpdateDto {
    title?: string | null;
    linkedSpecPattern?: any | null;
    technicalSolution?: string | null;
    severity?: IssueSeverity | null;
    isVerified?: boolean | null;
}

export interface KnowledgeBaseFilterDto extends pagination {
    searchTerm?: string | null;
    severity?: IssueSeverity | null;
    isVerified?: boolean | null;
}