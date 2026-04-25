import axiosClient from "@/services/axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { ApiResponse } from "@/types/apiResponse";
import type { PagedResult } from "@/types/paginationResult";
import type {
    KnowledgeBaseFilterDto,
    TechnicalKnowledgeBaseListDto,
    TechnicalKnowledgeBaseDetailDto,
    TechnicalKnowledgeBaseCreateDto
} from "@/types/knowledge-base";

// Định nghĩa thêm DTO cho Smart Suggestions (vì nó trả về cấu trúc riêng từ BE)
export interface SuggestionResponseDto {
    id: string;
    title: string;
    attachments: Array<{
        id: string;
        fileName: string;
        fileType: string;
    }>;
}

export const knowledgeBaseService = {

    getList: async (filter: KnowledgeBaseFilterDto): Promise<PagedResult<TechnicalKnowledgeBaseListDto>> => {
        const response = await axiosClient.get<ApiResponse<PagedResult<TechnicalKnowledgeBaseListDto>>>(
            API_ENDPOINTS.knowledgeBase.getList(filter)
        );
        return response.data.data;
    },

    getDetail: async (id: string, searchTerm?: string): Promise<TechnicalKnowledgeBaseDetailDto> => {
        const response = await axiosClient.get<ApiResponse<TechnicalKnowledgeBaseDetailDto>>(
            API_ENDPOINTS.knowledgeBase.getDetail(id, searchTerm)
        );
        return response.data.data;
    },

    create: async (data: TechnicalKnowledgeBaseCreateDto): Promise<string> => {
        const response = await axiosClient.post<ApiResponse<string>>(
            API_ENDPOINTS.knowledgeBase.create,
            data
        );
        return response.data.data;
    },

    delete: async (id: string): Promise<boolean> => {
        const response = await axiosClient.delete<ApiResponse<boolean>>(
            API_ENDPOINTS.knowledgeBase.delete(id)
        );
        return response.data.data;
    },

    getSmartSuggestions: async (query: string): Promise<SuggestionResponseDto[]> => {
        const response = await axiosClient.get<ApiResponse<SuggestionResponseDto[]>>(
            API_ENDPOINTS.knowledgeBase.smartSuggestions(query)
        );
        return response.data.data;
    },

    download: async (id: string, fileName: string): Promise<void> => {
        const response = await axiosClient.get(
            API_ENDPOINTS.knowledgeBase.download(id),
            { responseType: 'blob' }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
};