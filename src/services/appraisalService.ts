import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../config/apiConfig";
import type { ApiResponse } from "../types/apiResponse";

import type {
    AppraisalAssignmentDetailDto,
    AssignStaffRequest,
    CompleteAssignmentRequest,
    CreateParallelAssignmentsRequest,
    ConsolidateAppraisalRequest,
    AppraisalAssignmentDto
} from "../types/assignment";

import type {
    AppraisalReviewerDetailDto,
    AppraisalReviewerDto,
    UpdateReviewerProgressRequest
} from "../types/reviewer";

import type { PagedResult } from "../types/paginationResult";
import type { pagination } from "../types/pagination";

const handleResponse = <T>(res: { data: ApiResponse<T> }) => {
    if (!res.data.isSuccess) {
        throw new Error(res.data.message || "API Error");
    }
    return res.data.data;
};

export const appraisalService = {

    getDirectorAssignments: async (
        params: pagination
    ): Promise<PagedResult<AppraisalAssignmentDto>> => {
        const res = await axiosClient.get<ApiResponse<PagedResult<AppraisalAssignmentDto>>>(
            API_ENDPOINTS.appraisal.listDirectorAssignments,
            { params }
        );
        return handleResponse(res);
    },

    getManagerAssignments: async (
        versionId: string | undefined,
        params: pagination
    ): Promise<PagedResult<AppraisalAssignmentDto>> => {
        const res = await axiosClient.get<
            ApiResponse<PagedResult<AppraisalAssignmentDto>>
        >(
            API_ENDPOINTS.appraisal.listManagerAssignments(versionId),
            { params }
        );

        return handleResponse(res);
    },

    getReviewerAssignments: async (
        assignmentId: string | undefined,
        params: pagination
    ): Promise<PagedResult<AppraisalReviewerDto>> => {
        const res = await axiosClient.get<ApiResponse<PagedResult<AppraisalReviewerDto>>>(
            API_ENDPOINTS.appraisal.listReviewer(assignmentId),
            { params }
        );
        return handleResponse(res);
    },

    getReviewerDetail: async (
        reviewerId: string
    ): Promise<AppraisalReviewerDetailDto> => {
        const res = await axiosClient.get<ApiResponse<AppraisalReviewerDetailDto>>(
            API_ENDPOINTS.appraisal.getReviewerDetail(reviewerId)
        );
        return handleResponse(res);
    },

    createParallelAssignments: async (
        data: CreateParallelAssignmentsRequest
    ): Promise<void> => {
        const res = await axiosClient.post<ApiResponse<any>>(
            API_ENDPOINTS.appraisal.createParallel,
            data
        );
        handleResponse(res);
    },

    assignStaff: async (data: AssignStaffRequest): Promise<void> => {
        const res = await axiosClient.post<ApiResponse<any>>(
            API_ENDPOINTS.appraisal.assignStaff,
            data
        );
        handleResponse(res);
    },

    confirmDepartment: async (
        documentId: string,
        data: CompleteAssignmentRequest
    ): Promise<void> => {
        const res = await axiosClient.post<ApiResponse<any>>(
            API_ENDPOINTS.appraisal.confirmDepartment(documentId),
            data
        );
        handleResponse(res);
    },

    submitReview: async (
        reviewerId: string,
        data: UpdateReviewerProgressRequest
    ): Promise<void> => {
        const res = await axiosClient.put<ApiResponse<any>>(
            API_ENDPOINTS.appraisal.submitReview(reviewerId),
            data
        );
        handleResponse(res);
    },

    confirmCenter: async (
        data: ConsolidateAppraisalRequest
    ): Promise<void> => {
        const res = await axiosClient.post<ApiResponse<any>>(
            API_ENDPOINTS.appraisal.confirmCenter,
            data
        );
        handleResponse(res);
    },

    getAssignmentById: async (
        id: string
    ): Promise<AppraisalAssignmentDetailDto> => {
        const res = await axiosClient.get<ApiResponse<AppraisalAssignmentDetailDto>>(
            API_ENDPOINTS.appraisal.getDetail(id)
        );
        return handleResponse(res);
    },

    recallAssignments: async (documentId: string): Promise<boolean> => {
        const res = await axiosClient.post<ApiResponse<boolean>>(
            API_ENDPOINTS.appraisal.recallAssignments,
            documentId
        );
        return handleResponse(res);
    },
};