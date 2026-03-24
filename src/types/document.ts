// export interface TechnicalDocumentListDto {
//     id: string;
//     title: string;
//     type: DocumentType;
//     priority: IssueSeverity;
//     status: DocumentStatus;
//     requesterName: string;
//     createdAt: string;
//     departmentName: string;
// }

// export interface TechnicalDocumentDetailDto extends TechnicalDocumentListDto {
//     currentHandlerName?: string;
//     requesterId: string;
//     currentVersion?: DocumentVersionDto;
//     attachments: AttachmentResponseDto[];
//     histories: AppraisalHistoryResponseDto[];
// }

// export interface TechnicalDocumentCreateDto {
//     title: string;
//     description: string;
//     type: DocumentType;
//     priority: IssueSeverity;
//     technicalSpecsJson: string;
// }

// export interface TechnicalDocumentUpdateDto {
//     title: string;
//     description: string;
//     type: DocumentType;
//     priority: IssueSeverity;
//     technicalSpecsJson: string;
// }

// export interface DocumentFilterDto extends PaginationDto {
//     searchTerm?: string;
//     type?: DocumentType;
//     departmentId?: string;
//     status?: DocumentStatus;
//     fromDate?: string;
//     toDate?: string;
// }