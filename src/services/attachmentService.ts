import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { ApiResponse } from "@/types/apiResponse";

export interface AttachmentUploadResponseDto {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    url?: string;
}

export const attachmentService = {
    upload: async (
        file: File,
        entityId: string,
        category: number
    ): Promise<AttachmentUploadResponseDto> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("entityId", entityId);
        formData.append("category", category.toString());

        const response = await axiosClient.post<ApiResponse<AttachmentUploadResponseDto>>(
            API_ENDPOINTS.attachments.upload,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
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