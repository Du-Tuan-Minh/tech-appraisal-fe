export interface DocumentVersionDto {
    id: string;
    requestId: string;
    versionNumber: number;
    technicalSpecsJson?: any | null;
}

export interface DocumentVersionDetailDto extends DocumentVersionDto {
    changeReason?: string | null;
    isCurrent: boolean;
    createdAt: string;
    sourceIssueId?: string | null;
}

export interface DocumentVersionCreateDto {
    requestId: string;
    technicalSpecsJson: any;
    changeReason?: string | null;
    sourceIssueId?: string | null;
}