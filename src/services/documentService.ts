import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";

import type {
    TechnicalDocumentCreateDto,
    TechnicalDocumentUpdateDto,
    DocumentFilterDto
} from "../types/document";

import type { PagedResult } from "../types/paginationResult";

export const documentService = {
    getDocuments: async (filters: DocumentFilterDto): Promise<PagedResult<any>> => {
        const response = await axiosClient.get(API_ENDPOINTS.documents.list, {
            params: filters
        });
        return response.data;
    },

    getDocumentById: async (id: string) => {
        const response = await axiosClient.get(API_ENDPOINTS.documents.getDetail(id));
        return response.data;
    },

    createDocument: async (data: TechnicalDocumentCreateDto) => {
        const response = await axiosClient.post(API_ENDPOINTS.documents.create, data);
        return response.data;
    },

    updateDocument: async (id: string, data: TechnicalDocumentUpdateDto) => {
        const response = await axiosClient.put(API_ENDPOINTS.documents.updateDraft(id), data);
        return response.data;
    },

    handleFeedback: async (id: string, feedbackData: any) => {
        const response = await axiosClient.post(API_ENDPOINTS.documents.handleFeedback(id), feedbackData);
        return response.data;
    },

    submitForAppraisal: async (id: string) => {
        const response = await axiosClient.post(API_ENDPOINTS.documents.submitInternal(id));
        return response.data;
    }
};