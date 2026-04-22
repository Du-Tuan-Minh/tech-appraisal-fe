import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { ApiResponse } from "@/types/apiResponse";
import type { AppraisalRejectDto } from "../types/history";
import type { SendParallelAssignmentsRequest } from "@/types/assignment";

export const signingService = {
    approveSign: async (data: SendParallelAssignmentsRequest): Promise<boolean> => {
        const response = await axiosClient.post<ApiResponse<boolean>>(
            API_ENDPOINTS.signing.approve,
            data
        );
        return response.data.data;
    },

    reject: async (data: AppraisalRejectDto): Promise<boolean> => {
        const response = await axiosClient.post<ApiResponse<boolean>>(
            API_ENDPOINTS.signing.reject,
            data
        );
        return response.data.data;
    },

    submitIssue: async (docId: string): Promise<boolean> => {
        const response = await axiosClient.post<ApiResponse<boolean>>(
            API_ENDPOINTS.signing.issue(docId)
        );
        return response.data.data;
    },

    exportPdf: async (versionId: string): Promise<Blob> => {
        const response = await axiosClient.get(
            API_ENDPOINTS.signing.exportPdf(versionId),
            { responseType: 'blob' }
        );
        return response.data;
    }
};