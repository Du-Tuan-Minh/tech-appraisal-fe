import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { ApiResponse } from "@/types/apiResponse";
import type { PagedResult } from "../types/paginationResult";
import type {
    FeedbackIssueResponseDto,
    FeedbackIssueDetailDto,
    FeedbackIssueCreateDto
} from "@/types/feedback";

export const feedbackService = {
    getByDocument: async (
        documentId: string,
        page = 1,
        pageSize = 10
    ): Promise<PagedResult<FeedbackIssueResponseDto>> => {
        const res = await axiosClient.get<ApiResponse<PagedResult<FeedbackIssueResponseDto>>>(
            API_ENDPOINTS.feedback.getByDocument(documentId),
            { params: { page, pageSize } }
        );
        return res.data.data;
    },

    getByVersion: async (
        versionId: string,
        page = 1,
        pageSize = 10
    ): Promise<PagedResult<FeedbackIssueResponseDto>> => {
        const res = await axiosClient.get<ApiResponse<PagedResult<FeedbackIssueResponseDto>>>(
            API_ENDPOINTS.feedback.getByVersion(versionId),
            { params: { page, pageSize } }
        );
        return res.data.data;
    },

    getDetail: async (id: string): Promise<FeedbackIssueDetailDto> => {
        const res = await axiosClient.get<ApiResponse<FeedbackIssueDetailDto>>(
            API_ENDPOINTS.feedback.getDetail(id)
        );
        return res.data.data;
    },

    addReviewIssue: async (
        data: FeedbackIssueCreateDto
    ): Promise<FeedbackIssueResponseDto> => {
        const res = await axiosClient.post<ApiResponse<FeedbackIssueResponseDto>>(
            API_ENDPOINTS.feedback.addReviewIssue,
            data
        );
        return res.data.data;
    }
};