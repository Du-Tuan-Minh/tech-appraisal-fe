import type { IssueSeverity } from "@/constants/enum/IssueSeverity";

export interface TechnicalKnowledgeBaseResponseDto {
    id: string;
    title: string;
    deviceCategory: string;
    issueType: string;
    linkedSpecPattern: string;
    technicalSolution: string;
    severity: IssueSeverity;
    occurrenceCount: number;
    isVerified: boolean;
    verifiedByName?: string | null;
    lastVerifiedAt?: string | null;
    createdAt: string;
}

export interface TechnicalKnowledgeBaseUpdateDto {
    title?: string | null;
    linkedSpecPattern?: string | null;
    technicalSolution?: string | null;
    severity?: IssueSeverity | null;
    isVerified?: boolean | null;
}

export interface TechnicalKnowledgeBaseCreateDto {
    title: string;
    deviceCategory: string;
    issueType: string;
    linkedSpecPattern: string;
    technicalSolution: string;
    severity: IssueSeverity;
}