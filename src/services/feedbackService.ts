import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { ApiResponse } from "@/types/apiResponse";
import type { PagedResult } from "../types/paginationResult";
import type {
    FeedbackIssueResponseDto,
    FeedbackIssueCreateDto,
    FeedbackIssueUpdateDto,
    FeedbackActionRequestDto
} from "@/types/feedback";

export const feedbackService = {
    getByDocument: async (documentId: string, pageIndex = 1, pageSize = 10): Promise<PagedResult<FeedbackIssueResponseDto>> => {
        const response = await axiosClient.get<ApiResponse<PagedResult<FeedbackIssueResponseDto>>>(
            API_ENDPOINTS.feedback.getByDocument(documentId),
            { params: { pageIndex, pageSize } }
        );
        return response.data.data;
    },

    getDetail: async (id: string): Promise<FeedbackIssueResponseDto> => {
        const response = await axiosClient.get<ApiResponse<FeedbackIssueResponseDto>>(
            API_ENDPOINTS.feedback.getDetail(id)
        );
        return response.data.data;
    },

    reportIssue: async (data: FeedbackIssueCreateDto): Promise<FeedbackIssueResponseDto> => {
        const response = await axiosClient.post<ApiResponse<FeedbackIssueResponseDto>>(
            API_ENDPOINTS.feedback.report,
            data
        );
        return response.data.data;
    },

    addReviewIssue: async (data: FeedbackIssueCreateDto): Promise<FeedbackIssueResponseDto> => {
        const response = await axiosClient.post<ApiResponse<FeedbackIssueResponseDto>>(
            API_ENDPOINTS.feedback.addReviewIssue,
            data
        );
        return response.data.data;
    },

    updateStatus: async (id: string, data: FeedbackIssueUpdateDto): Promise<void> => {
        await axiosClient.put<ApiResponse<any>>(
            API_ENDPOINTS.feedback.updateStatus(id),
            data
        );
    },

    submitAction: async (data: FeedbackActionRequestDto): Promise<void> => {
        await axiosClient.post<ApiResponse<any>>(
            API_ENDPOINTS.feedback.finalize(data.issueId),
            data
        );
    }
};