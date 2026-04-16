import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../config/apiConfig";
import type { ApiResponse } from "../types/apiResponse";

import type {
    AppraisalAssignmentDetailDto,
    AssignStaffRequest,
    CompleteAssignmentRequest,
    CreateParallelAssignmentsRequest,
    ConsolidateAppraisalRequest
} from "../types/assignment";

import type {
    UpdateReviewerProgressRequest
} from "../types/reviewer";

import type { PagedResult } from "../types/paginationResult";
import type { pagination } from "../types/pagination";

export const appraisalService = {
    getAssignments: async (
        params: pagination
    ): Promise<PagedResult<AppraisalAssignmentDetailDto>> => {
        const res = await axiosClient.get<ApiResponse<PagedResult<AppraisalAssignmentDetailDto>>>(
            API_ENDPOINTS.appraisal.listAssignments,
            { params }
        );
        return res.data.data;
    },

    createParallelAssignments: async (
        data: CreateParallelAssignmentsRequest
    ): Promise<void> => {
        await axiosClient.post<ApiResponse<any>>(
            API_ENDPOINTS.appraisal.createParallel,
            data
        );
    },

    assignStaff: async (data: AssignStaffRequest): Promise<void> => {
        await axiosClient.post<ApiResponse<any>>(
            API_ENDPOINTS.appraisal.assignStaff,
            data
        );
    },

    confirmDepartment: async (
        documentId: string,
        data: CompleteAssignmentRequest
    ): Promise<void> => {
        await axiosClient.post<ApiResponse<any>>(
            API_ENDPOINTS.appraisal.confirmDepartment(documentId),
            data
        );
    },

    submitReview: async (
        reviewerId: string,
        data: UpdateReviewerProgressRequest
    ): Promise<void> => {
        await axiosClient.put<ApiResponse<any>>(
            API_ENDPOINTS.appraisal.submitReview(reviewerId),
            data
        );
    },

    finalize: async (
        data: ConsolidateAppraisalRequest
    ): Promise<void> => {
        await axiosClient.post<ApiResponse<any>>(
            API_ENDPOINTS.appraisal.finalize,
            data
        );
    },

    getAssignmentById: async (
        id: string
    ): Promise<AppraisalAssignmentDetailDto> => {
        const res = await axiosClient.get<ApiResponse<AppraisalAssignmentDetailDto>>(
            API_ENDPOINTS.appraisal.getDetail(id)
        );
        return res.data.data;
    },
};