import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { AttachmentCategory } from "@/constants/enum/AttachmentCategory";
import type { ApiResponse } from "@/types/apiResponse";
import type { AttachmentResponseDto } from "@/types/attachment";

export const attachmentService = {
    upload: async (
        file: File,
        entityId: string,
        category: AttachmentCategory
    ): Promise<AttachmentResponseDto> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("technicalDocumentId", entityId);
        formData.append("contentCategory", category.toString());

        const response = await axiosClient.post<ApiResponse<AttachmentResponseDto>>(
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
            API_ENDPOINTS.attachments.fileDetail(id),
            {
                responseType: "blob",
            }
        );

        return response.data;
    },
};