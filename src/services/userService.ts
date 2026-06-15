import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { ApiResponse } from "@/types/apiResponse";
import type { UserResponseDto, UpdateProfileDto, ChangePasswordDto, UserUpdateAccountDto, UserDetailResponseDto, UserFilterDto, DocumentTypeStatisticDto, UserAppraisalAssigneeDto } from "../types/user";
import type { UserRole } from "../constants/enum/UserRole";
import type { PagedResult } from "@/types/paginationResult";

export const getProfile = async (): Promise<UserDetailResponseDto> => {
    const res = await axiosClient.get<ApiResponse<UserDetailResponseDto>>(
        API_ENDPOINTS.users.profile
    );
    return res.data.data;
};

export const updateProfile = async (data: UpdateProfileDto): Promise<UserResponseDto> => {
    const res = await axiosClient.put<ApiResponse<UserResponseDto>>(
        API_ENDPOINTS.users.updateProfile,
        data
    );
    return res.data.data;
};

export const changePassword = async (data: ChangePasswordDto): Promise<any> => {
    const res = await axiosClient.post<ApiResponse<any>>(
        API_ENDPOINTS.users.changePassword,
        data
    );
    return res.data.data;
};

export const getUsers = async (filters: UserFilterDto): Promise<PagedResult<UserResponseDto>> => {
    const res = await axiosClient.get<ApiResponse<PagedResult<UserResponseDto>>>(
        API_ENDPOINTS.users.filter,
        { params: filters }
    );
    return res.data.data;
};

// export const requestPromotion = async (data: { currentRole: UserRole; requestedRole: UserRole; reason: string }) => {
//     const res = await axiosClient.post<ApiResponse<any>>(API_ENDPOINTS.users.requestPromotion, data);
//     return res.data.data;
// };

export const requestPromotion = async (currentRole: UserRole, requestedRole: UserRole, reason: string) => {
    const res = await axiosClient.post<ApiResponse<any>>(
        API_ENDPOINTS.users.requestPromotion + `?requestedRole=${requestedRole}`,
        reason
    );
    return res.data.data;
};

export const updateAccountStatus = async (id: string, data: UserUpdateAccountDto) => {
    const res = await axiosClient.patch<ApiResponse<any>>(API_ENDPOINTS.users.updateAccountStatus(id), data);
    return res.data.data;
};

export const getUserDetail = async (id: string): Promise<UserDetailResponseDto> => {
    const res = await axiosClient.get<ApiResponse<UserDetailResponseDto>>(
        API_ENDPOINTS.users.detail(id)
    );
    return res.data.data;
};

export const getSeniorCenter = async (page: number = 1, pageSize: number = 10, searchTerm?: string): Promise<PagedResult<UserResponseDto>> => {
    const response = await axiosClient.get<ApiResponse<PagedResult<UserResponseDto>>>(
        API_ENDPOINTS.users.getSeniorCenter({ page, pageSize }, searchTerm)
    );
    return response.data.data;
};

export const getTopRejectedDocumentTypes = async (
    page: number = 1,
    pageSize: number = 10,
): Promise<PagedResult<DocumentTypeStatisticDto>> => {
    const res = await axiosClient.get<
        ApiResponse<PagedResult<DocumentTypeStatisticDto>>
    >(
        API_ENDPOINTS.users.topRejectedDocumentTypes({ page, pageSize })
    );

    return res.data.data;
};

export const getDepartmentAppraisalWorkloads = async (
    page: number = 1,
    pageSize: number = 10,
    searchTerm?: string
): Promise<PagedResult<UserAppraisalAssigneeDto>> => {
    const res = await axiosClient.get<
        ApiResponse<PagedResult<UserAppraisalAssigneeDto>>
    >(API_ENDPOINTS.users.departmentAppraisalWorkloads, {
        params: { page, pageSize, searchTerm },
    });

    return res.data.data;
};