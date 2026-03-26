import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { ApiResponse } from "@/types/apiResponse";
import type { UserResponseDto, UpdateProfileDto, ChangePasswordDto, UserUpdateAccountDto } from "../types/user";
import type { UserRole } from "../constants/enum/UserRole";

export const getProfile = async (): Promise<UserResponseDto> => {
    const res = await axiosClient.get<ApiResponse<UserResponseDto>>(
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
        "/users/change-password",
        data
    );
    return res.data.data;
};

export const getUsers = async (filters: any) => {
    const res = await axiosClient.get<ApiResponse<any>>(
        API_ENDPOINTS.users.filter,
        { params: filters }
    );
    return res.data.data;
};

export const requestPromotion = async (data: { currentRole: UserRole; requestedRole: UserRole; reason: string }) => {
    const res = await axiosClient.post<ApiResponse<any>>(API_ENDPOINTS.users.requestPromotion, data);
    return res.data.data;
};

export const updateAccountStatus = async (id: string, data: UserUpdateAccountDto) => {
    const res = await axiosClient.put<ApiResponse<any>>(API_ENDPOINTS.users.updateAccountStatus(id), data);
    return res.data.data;
};
