import type { AttachmentCategory } from "@/constants/enum/AttachmentCategory";
import type { LinkedEntityType } from "@/constants/enum/LinkedEntityType";

export interface AttachmentLinkDto {
    entityId: string;
    entityType: LinkedEntityType;
}

export interface AttachmentResponseDto {
    id: string;
    technicalDocumentId: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    contentCategory: AttachmentCategory;
    uploadedById: string;
    uploaderName: string;
    createdAt: string;
    links: AttachmentLinkDto[];
}

export interface AttachmentCreateDto {
    technicalDocumentId: string;
    contentCategory: AttachmentCategory;
    file: File;
    linkedEntityId?: string | null;
    linkedEntityType?: LinkedEntityType | null;
}

export interface FileStreamResultDto {
    fileStream: Blob;
    fileType: string;
    fileName: string;
}

export interface CreateAttachmentLinkRequest {
    attachmentId: string;
    entityId: string;
    entityType: LinkedEntityType;
}