import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { LinkedEntityType } from "@/constants/enum/LinkedEntityType";
import type { ApiResponse } from "@/types/apiResponse";
import type { AttachmentResponseDto } from "@/types/attachment";
import {
    AttachmentCategory
} from "@/constants/enum/AttachmentCategory";

export const attachmentService = {
    upload: async (
        file: File,
        technicalDocumentId: string,
        contentCategory: AttachmentCategory,
        entityId?: string,
        entityType?: LinkedEntityType
    ): Promise<AttachmentResponseDto> => {
        const formData = new FormData();

        formData.append("File", file);
        formData.append("TechnicalDocumentId", technicalDocumentId);
        formData.append("ContentCategory", String(Number(contentCategory)));

        if (entityId) {
            formData.append("LinkedEntityId", entityId);
        }

        if (entityType !== undefined) {
            formData.append("LinkedEntityType", String(Number(entityType)));
        }

        const response = await axiosClient.post<
            ApiResponse<AttachmentResponseDto>
        >(
            API_ENDPOINTS.attachments.upload,
            formData
        );

        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await axiosClient.delete<ApiResponse<any>>(
            API_ENDPOINTS.attachments.delete(id)
        );
    },

    getFile: async (id: string): Promise<Blob> => {
        const response = await axiosClient.get(
            API_ENDPOINTS.attachments.getFile(id),
            {
                responseType: "blob",
            }
        );

        return response.data;
    },
};