import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../config/apiConfig";
import type { ApiResponse } from "../types/apiResponse";
import type { AppraisalAssignmentDto, AssignStaffRequest, CompleteAssignmentRequest } from "../types/assignment";
import type { AppraisalReviewerDto, UpdateAppraisalReviewerDto } from "../types/reviewer";
import type { UserResponseDto } from "../types/user";

export interface AssignmentFilters {
    page?: number;
    pageSize?: number;
    status?: string;
    departmentId?: string;
}

export const appraisalService = {
    getAssignments: async (filters?: AssignmentFilters) => {
        const res = await axiosClient.get<ApiResponse<any>>(
            API_ENDPOINTS.appraisal.assignStaff,
            {
                params: filters
            }
        );
        return res.data.data;
    },

    confirmDepartment: async (data: {
        documentId: string;
        CompleteAssignmentRequest: CompleteAssignmentRequest;
    }) => {
        const res = await axiosClient.post<ApiResponse<any>>(
            API_ENDPOINTS.appraisal.confirmDepartment,
            data
        );
        return res.data.data;
    },

    assignStaff: async (data: AssignStaffRequest) => {
        const res = await axiosClient.post<ApiResponse<any>>(
            API_ENDPOINTS.appraisal.assignStaff,
            data
        );
        return res.data.data;
    },

    submitReview: async (reviewerId: string, data: UpdateAppraisalReviewerDto) => {
        const res = await axiosClient.post<ApiResponse<any>>(
            API_ENDPOINTS.appraisal.submitReview(reviewerId),
            data
        );
        return res.data.data;
    },

    getAssignmentById: async (id: string): Promise<AppraisalAssignmentDto> => {
        const response = await axiosClient.get<ApiResponse<AppraisalAssignmentDto>>(
            API_ENDPOINTS.appraisal.getDetail(id)
        );
        return response.data.data;
    },

    getDepartmentUsers: async (departmentId: string): Promise<UserResponseDto[]> => {
        const res = await axiosClient.get<ApiResponse<UserResponseDto[]>>(
            `/users/department/${departmentId}/users`
        );
        return res.data.data;
    },

    // rejectDocument: async (data: {
    //     documentId: string;
    //     reason: string;
    //     technicalSpecsJson?: string;
    // }) => {
    //     const res = await axiosClient.post<ApiResponse<any>>(
    //         API_ENDPOINTS.signing.reject,
    //         data
    //     );
    //     return res.data.data;
    // }
};
