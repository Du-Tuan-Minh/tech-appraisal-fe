export interface DocumentVersionDto {
    id: string;
    requestId: string;
    versionNumber: number;
    technicalSpecsJson: Record<string, any>;
}

export interface DocumentVersionDetailDto extends DocumentVersionDto {
    changeReason?: string | null;
    isCurrent: boolean;
    createdAt: string;
    sourceIssueId?: string | null;
}

export interface DocumentVersionCreateDto {
    technicalSpecsJson: Record<string, any>;
    changeReason?: string | null;
}