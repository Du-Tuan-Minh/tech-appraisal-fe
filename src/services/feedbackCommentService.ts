import axiosClient from "@/services/axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { ApiResponse } from "@/types/apiResponse";
import type { PagedResult } from "@/types/paginationResult";

import type {
    FeedbackCommentDto,
    CreateFeedbackCommentRequest
} from "../types/comment";

export const feedbackCommentService = {
    create: async (data: CreateFeedbackCommentRequest): Promise<FeedbackCommentDto> => {
        const response = await axiosClient.post<ApiResponse<FeedbackCommentDto>>(
            API_ENDPOINTS.feedbackComments.create,
            data
        );

        return response.data.data;
    },

    getByIssue: async (
        issueId: string,
        page: number = 1,
        pageSize: number = 10
    ): Promise<PagedResult<FeedbackCommentDto>> => {
        const response = await axiosClient.get<ApiResponse<PagedResult<FeedbackCommentDto>>>(
            API_ENDPOINTS.feedbackComments.getByIssue(issueId, { page, pageSize })
        );

        return response.data.data;
    }
};