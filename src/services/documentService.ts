import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { ApiResponse } from "@/types/apiResponse";

import type {
    TechnicalDocumentCreateDto,
    TechnicalDocumentUpdateDto,
    DocumentFilterDto,
    TechnicalDocumentResponseDto,
    TechnicalDocumentDetailDto
} from "@/types/document";

import type { PagedResult } from "@/types/paginationResult";
import type { pagination } from "@/types/pagination";

import type { DocumentVersionDto, DocumentVersionDetailDto } from "@/types/version";
import type { FeedbackActionRequestDto } from "@/types/feedback";
import type { DocumentVersionCreateDto } from "@/types/version";

export const documentService = {

    getDocuments: async (
        filters: DocumentFilterDto
    ): Promise<PagedResult<TechnicalDocumentResponseDto>> => {
        const res = await axiosClient.get<ApiResponse<PagedResult<TechnicalDocumentResponseDto>>>(
            API_ENDPOINTS.documents.list,
            { params: filters }
        );
        return res.data.data;
    },

    getDocumentById: async (id: string): Promise<TechnicalDocumentDetailDto> => {
        const res = await axiosClient.get<ApiResponse<TechnicalDocumentDetailDto>>(
            API_ENDPOINTS.documents.getDetail(id)
        );
        return res.data.data;
    },

    createDocument: async (
        data: TechnicalDocumentCreateDto
    ): Promise<TechnicalDocumentResponseDto> => {
        const res = await axiosClient.post<ApiResponse<TechnicalDocumentResponseDto>>(
            API_ENDPOINTS.documents.create,
            data
        );
        return res.data.data;
    },

    updateDocument: async (
        id: string,
        data: TechnicalDocumentUpdateDto
    ): Promise<boolean> => {
        const res = await axiosClient.put<ApiResponse<boolean>>(
            API_ENDPOINTS.documents.updateDraft(id),
            data
        );

        return res.data.data;
    },

    submitForAppraisal: async (id: string): Promise<void> => {
        await axiosClient.post<ApiResponse<any>>(
            API_ENDPOINTS.documents.submitInternal(id)
        );
    },

    handleFeedback: async (
        id: string,
        data: FeedbackActionRequestDto
    ): Promise<void> => {
        await axiosClient.post<ApiResponse<any>>(
            API_ENDPOINTS.documents.handleFeedback(id),
            data
        );
    },

    getMyTasks: async (
        pagination: pagination
    ): Promise<PagedResult<TechnicalDocumentResponseDto>> => {
        const res = await axiosClient.get<ApiResponse<PagedResult<TechnicalDocumentResponseDto>>>(
            API_ENDPOINTS.documents.myTasks,
            { params: pagination }
        );
        return res.data.data;
    },

    getDocumentVersions: async (
        documentId: string
    ): Promise<DocumentVersionDto[]> => {
        const res = await axiosClient.get<ApiResponse<DocumentVersionDto[]>>(
            API_ENDPOINTS.documents.getVersions(documentId)
        );
        return res.data.data;
    },

    getVersionDetail: async (
        versionId: string
    ): Promise<DocumentVersionDetailDto> => {
        const res = await axiosClient.get<ApiResponse<DocumentVersionDetailDto>>(
            API_ENDPOINTS.documents.getVersionDetail(versionId)
        );
        return res.data.data;
    },

    createFromImprovement: async (
        issueId: string,
        data: DocumentVersionCreateDto
    ): Promise<void> => {
        await axiosClient.post<ApiResponse<any>>(
            API_ENDPOINTS.documents.createVersionFromIssue(issueId),
            data
        );
    }
};