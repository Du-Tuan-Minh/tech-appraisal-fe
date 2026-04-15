import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { ApiResponse } from "@/types/apiResponse";
import type {
    TechnicalDocumentCreateDto,
    TechnicalDocumentUpdateDto,
    DocumentFilterDto,
    TechnicalDocumentResponseDto,
    TechnicalDocumentDetailDto
} from "../types/document";
import type { PagedResult } from "../types/paginationResult";

export const documentService = {
    getDocuments: async (filters: DocumentFilterDto): Promise<PagedResult<TechnicalDocumentResponseDto>> => {
        const response = await axiosClient.get<ApiResponse<PagedResult<TechnicalDocumentResponseDto>>>(
            API_ENDPOINTS.documents.list,
            { params: filters }
        );
        return response.data.data;
    },

    getDocumentById: async (id: string): Promise<TechnicalDocumentDetailDto> => {
        const response = await axiosClient.get<ApiResponse<TechnicalDocumentDetailDto>>(
            API_ENDPOINTS.documents.getDetail(id)
        );
        return response.data.data;
    },

    createDocument: async (data: TechnicalDocumentCreateDto): Promise<TechnicalDocumentResponseDto> => {
        const response = await axiosClient.post<ApiResponse<TechnicalDocumentResponseDto>>(
            API_ENDPOINTS.documents.create,
            data
        );
        return response.data.data;
    },

    updateDocument: async (id: string, data: TechnicalDocumentUpdateDto): Promise<TechnicalDocumentResponseDto> => {
        const response = await axiosClient.put<ApiResponse<TechnicalDocumentResponseDto>>(
            API_ENDPOINTS.documents.updateDraft(id),
            data
        );
        return response.data.data;
    },

    handleFeedback: async (id: string, feedbackData: any): Promise<any> => {
        const response = await axiosClient.post<ApiResponse<any>>(
            API_ENDPOINTS.documents.handleFeedback(id),
            feedbackData
        );
        return response.data.data;
    },

    submitForAppraisal: async (id: string): Promise<void> => {
        await axiosClient.post<ApiResponse<any>>(API_ENDPOINTS.documents.submitInternal(id));
    },

    getMyTasks: async (filters: DocumentFilterDto): Promise<PagedResult<TechnicalDocumentResponseDto>> => {
        const response = await axiosClient.get<ApiResponse<PagedResult<TechnicalDocumentResponseDto>>>(
            API_ENDPOINTS.documents.myTasks,
            { params: filters }
        );
        return response.data.data;
    },

    getDocumentVersions: async (documentId: string): Promise<any[]> => {
        const response = await axiosClient.get<ApiResponse<any[]>>(
            API_ENDPOINTS.documents.getVersions(documentId)
        );
        return response.data.data;
    },

    getVersionDetail: async (versionId: string): Promise<any> => {
        const response = await axiosClient.get<ApiResponse<any>>(
            API_ENDPOINTS.documents.getVersionDetail(versionId)
        );
        return response.data.data;
    },

    updateVersion: async (versionId: string, data: any): Promise<any> => {
        const response = await axiosClient.put<ApiResponse<any>>(
            API_ENDPOINTS.documents.updateVersion(versionId),
            data
        );
        return response.data.data;
    },

    createFromImprovement: async (issueId: string, data: any): Promise<any> => {
        const response = await axiosClient.post<ApiResponse<any>>(
            API_ENDPOINTS.documents.createVersionFromIssue(issueId),
            data
        );
        return response.data.data;
    }
};