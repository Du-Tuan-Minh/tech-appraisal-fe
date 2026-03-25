import type { AttachmentCategory } from "@/constants/enum/AttachmentCategory";

export interface AttachmentResponseDto {
    id: string;
    documentId: string;
    documentTitle: string;
    requestVersionId: string | null;
    appraisalHistoryId: string | null;
    feedbackIssueId: string | null;
    fileName: string;
    filePath: string;
    fileSize: number;
    fileType: string;
    contentCategory: AttachmentCategory;
    uploadedById: string;
    uploaderName: string;
    createdAt: string;
    appraisalReviewerId: string | null;
}

export interface AttachmentCreateDto {
    documentId: string;
    requestVersionId: string | null;
    appraisalHistoryId: string | null;
    feedbackIssueId: string | null;
    appraisalReviewerId: string | null;
    contentCategory: AttachmentCategory;
    file: File;
}

export interface FileStreamResultDto {
    fileStream: Blob;
    fileType: string;
    fileName: string;
}