import axiosClient from "@/services/axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type {
    DepartmentResponseDto,
    DepartmentCreateDto,
    DepartmentUpdateDto,
    DepartmentInvitationResponseDto,
    DepartmentInvitationCreateDto
} from "../types/department";
import type { PagedResult } from "../types/paginationResult";
import type { ApiResponse } from "@/types/apiResponse";

export const departmentService = {
    getDepartments: async (page: number = 1, pageSize: number = 10, searchTerm?: string, parentId?: string): Promise<PagedResult<DepartmentResponseDto>> => {
        const url = parentId
            ? API_ENDPOINTS.departments.getSubDepartments(parentId, { page, pageSize }, searchTerm)
            : API_ENDPOINTS.departments.getCenters({ page, pageSize }, searchTerm);

        const response = await axiosClient.get<ApiResponse<PagedResult<DepartmentResponseDto>>>(url);
        return response.data.data;
    },

    createDepartment: async (data: DepartmentCreateDto): Promise<DepartmentResponseDto> => {
        const response = await axiosClient.post<ApiResponse<DepartmentResponseDto>>(
            API_ENDPOINTS.departments.create,
            data
        );
        return response.data.data;
    },

    updateDepartment: async (id: string, data: DepartmentUpdateDto): Promise<DepartmentResponseDto> => {
        const response = await axiosClient.put<ApiResponse<DepartmentResponseDto>>(
            API_ENDPOINTS.departments.update(id),
            data
        );
        return response.data.data;
    },

    deleteDepartment: async (id: string): Promise<void> => {
        await axiosClient.delete<ApiResponse<any>>(API_ENDPOINTS.departments.delete(id));
    },

    createInvitation: async (data: DepartmentInvitationCreateDto): Promise<DepartmentInvitationResponseDto> => {
        const response = await axiosClient.post<ApiResponse<DepartmentInvitationResponseDto>>(
            API_ENDPOINTS.departments.invite,
            data
        );
        return response.data.data;
    },

    joinDepartment: async (invitationCode: string): Promise<void> => {
        await axiosClient.post<ApiResponse<any>>(
            `${API_ENDPOINTS.users.joinDepartment}?inviteCode=${invitationCode}`
        );
    }
};